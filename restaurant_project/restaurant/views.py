from drf_yasg.utils import swagger_auto_schema
from django.contrib.admindocs.utils import parse_rst
from rest_framework.decorators import action, permission_classes
from django.core.serializers import serialize
from rest_framework import viewsets, generics, permissions,status, parsers,filters
from .models import Category, Dish, User, Review,Reservation, Order,Transaction
from restaurant import serializers, paginators,perms
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.functions import TruncDay
from oauthlib.uri_validate import query
from rest_framework.permissions import IsAuthenticated
from .serializers import CompareDishSerializer
from django.db.models import  Sum, Avg, F


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.filter(active = True)
    serializer_class = serializers.CategorySerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.prefetch_related('ingredients').filter(active=True)
    serializer_class = serializers.DishSerializer
    pagination_class = paginators.DishPaginator
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['price', 'created_date']

    def get_serializer_class(self):
        if self.action == 'reviews':
            return serializers.ReviewSerializer
        return self.serializer_class

    def get_permissions(self):
        if self.action == 'reviews' and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    # @swagger_auto_schema(
    #     method='post',
    #     operation_description="Thêm đánh giá cho món ăn",
    #     request_body=serializers.ReviewSerializer,
    #     responses={201: serializers.ReviewSerializer()}
    # )
    @action(methods=['post','get'], url_path='reviews', detail=True)
    def reviews(self, request, pk):
        if request.method.__eq__('POST'):
            s = serializers.ReviewSerializer(data={
                'rating': request.data.get('rating'),
                'comment': request.data.get('comment'),
                'customer': request.user.pk,
                'dish': pk
            })
            s.is_valid(raise_exception=True)
            r = s.save()
            return Response(serializers.ReviewSerializer(r).data, status=status.HTTP_201_CREATED)

        reviews = self.get_object().reviews.select_related('customer').all().order_by('-created_date')
        p = paginators.DishPaginator()
        page = p.paginate_queryset(reviews, request)
        if page is not None:
            serializer = serializers.ReviewSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)

        return Response(serializers.ReviewSerializer(reviews, many=True).data, status=status.HTTP_200_OK)
class UserViewSet(viewsets.ViewSet,generics.CreateAPIView):
    queryset = User.objects.filter(is_active = True)
    serializer_class = serializers.UserSerializer

    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    @action(methods=['get', 'patch'], url_path='current-user',detail=False,permission_classes=[permissions.IsAuthenticated])
    def current_user(self,request):
        u = request.user

        if request.method == 'PATCH':
            serializer = serializers.UserSerializer(u,data=request.data,partial=True)
            serializer.is_valid(raise_exception=True)
            u = serializer.save()

        return Response(serializers.UserSerializer(u).data, status=status.HTTP_200_OK)

class ReviewViewSet(viewsets.ViewSet,generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Review.objects.all()
    serializer_class = serializers.ReviewSerializer
    permission_classes = [perms.IsReviewOwner]

class ReservationViewSet(viewsets.ViewSet,generics.ListAPIView,generics.CreateAPIView):
    serializer_class = serializers.ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(customer = self.request.user).order_by('-created_date')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class OrderViewSet(viewsets.ViewSet,generics.ListAPIView,generics.CreateAPIView):
    serializer_class =  serializers.OrderSerializer
    permission_classes =  [permissions.IsAuthenticated]

    def get_queryset(self):
        return  Order.objects.filter(customer = self.request.user).order_by('-created_date')

    @action(methods=['post'], detail=True, url_path='pay')
    def pay(self, request,pk):
        order = self.get_object()
        method = request.data.get('payment_method', 'CASH').upper()

        if order.transactions.filter(status = 'SUCCESS').exists():
            return Response({"error":"Đơn hàng này đã được thanh toán thành công trước đó"},status=status.HTTP_400_BAD_REQUEST)

        transaction = Transaction.objects.create(
            order=order,
            amount = order.total_amount,
            payment_method = method
        )
        if method == 'CASH':
            transaction.status = 'PENDING'
            transaction.save()
            return Response({
                "message": "Vui lòng thanh toán tiền mặt tại quầy",
                "transaction_id": transaction.id,
                "status": transaction.status
            }, status = status.HTTP_200_OK)
        elif method in ['MOMO', 'ZALOPAY', 'STRIPE', 'PAYPAL']:
            mock_payment_url = f"https://sandbox.payment-gateway.com/checkout?method={method}&amount={transaction.amount}&txnRef={transaction.id}"
            return Response({
                "message": f"Vui lòng truy cập đường dẫn để thanh toán qua {method}",
                "payment_url": mock_payment_url,
                "transaction_id": transaction.id,
                "status": transaction.status  # Vẫn đang là PENDING
            }, status=status.HTTP_200_OK)
        return Response({"error": "Phương thức thanh toán không hỗ trợ"}, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['get'], detail=True)
    def reviews(self, request, pk=None):
        dish = self.get_object()
        reviews = dish.reviews.all()
        serializer = serializers.ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        query= Dish.objects.filter(active=True).annotate(
            avg_rating=Avg('reviews__rating')
        )
        q = self.request.query_params.get('q')
        if q:
            queryset = self.get_queryset()

        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        prep_time = self.request.query_params.get('prep_time')
        if prep_time:
            queryset = queryset.filter(prep_time__gte=prep_time)
        ordering = self.request.query_params.get('ordering')
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = serializers.ReviewSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class CompareDishViewSet(viewsets.ViewSet):
    @action(methods=['get'], detail = False)
    def compare(self, request):
        ids = request.query_params.get('ids')

        if not ids:
            return Response({"error": "Vui lòng cung cấp ids"}, status=400)
        try:
            ids = [int(i) for i in ids.split(',')]
        except ValueError:
            return Response({"error": "ids phải là số"}, status=400)

        dishes = Dish.objects.filter(id__in=ids)\
            .annotate(avg_rating=Avg('reviews__rating'))

        serializer = CompareDishSerializer(dishes, many=True)
        return Response(serializer.data)

class StatsViewSet(viewsets.ViewSet):
    @action(methods=['get'], detail = False)
    def dish_stats(self,request):
        data = OrderDetail.objects.values('dish__name')\
        .annotate(
            total_quantity=Sum('quantity'),
            revenue=Sum(F('quantity') * F('unit_price'))
        ).order_by('-total_quantity')
        return Response(data)

    @action(detail=False, methods=['get'])
    def chefs(self,request):
        data = OrderDetail.objects.values('dish__chef__username')\
            .annotate(
                total_quantity=Sum('quantity'),
                revenue=Sum(F('quantity') * F('unit_price'))
        )
        return Response(data)

    @action(detail=False, methods=['get'])
    def revenue_by_day(self,request):
        data = OrderDetail.objects.annotate(
            day = TruncDay('order__created_date')
        ).values('day')\
        .annotate(
            revenue=Sum(F('quantity') * F('unit_price')),
        ).order_by('day')
        return Response(data)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = serializers.TransactionSerializer
    permission_classes = [IsAuthenticated]

