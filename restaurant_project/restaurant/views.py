from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from django.core.serializers import serialize
from rest_framework import viewsets, generics, permissions,status, parsers,filters
from .models import Category, Dish, User, Review, Reservation, Order, Transaction, OrderDetail, Ingredient
from restaurant import serializers, paginators,perms
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.functions import TruncDay
from oauthlib.uri_validate import query
from rest_framework.permissions import IsAuthenticated
from .serializers import CompareDishSerializer, ReviewSerializer, IngredientSerializer
from django.db.models import  Sum, Avg, F
from .serializers import DishSerializer
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.filter(active = True).order_by('-id')
    serializer_class = serializers.CategorySerializer

    permission_classes = [permissions.AllowAny]

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.prefetch_related('ingredients').filter(active=True)
    serializer_class = serializers.DishSerializer
    pagination_class = paginators.DishPaginator

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    filterset_fields = ['category', 'price', 'prep_time']
    ordering_fields = ['name', 'price', 'created_date']

    def get_queryset(self):
        queryset = Dish.objects.filter(active = True).order_by('-id')
        q =self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(name__icontains=q   )
        category_id =   self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        prep_time_max = self.request.query_params.get('prep_time_max')
        if prep_time_max:
            queryset = queryset.filter(prep_time__lte=prep_time_max)
        price_max = self.request.query_params.get('price_max')
        if price_max:
            queryset = queryset.filter(price__lte=price_max)
        chef_name = self.request.query_params.get('chef_name')
        if chef_name:
            queryset = queryset.filter(chef__username__icontains=chef_name)
        ordering = self.request.query_params.get('ordering')
        if ordering in ['name','-name' ,'price','-price']:
                queryset=queryset.order_by(ordering)

        return queryset

    def get_serializer_class(self):
        if self.action == 'reviews':
            return serializers.ReviewSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(chef=self.request.user)
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsApprovedChef()]
        elif self.action == 'reviews' and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'], url_path='chef-reviews', permission_classes=[permissions.IsAuthenticated])
    def chef_reviews(self, request):
        user = request.user

        if user.role != 'CHEF':
            return Response({"detail": "Bạn không có quyền xem dữ liệu này."}, status=status.HTTP_403_FORBIDDEN)

        reviews = Review.objects.filter(dish__chef=user).select_related('customer', 'dish').order_by('-created_date')

        data = []
        for r in reviews:
            data.append({
                "id": r.id,
                "rating": r.rating,
                "comment": r.comment,
                "created_date": r.created_date,
                "dish_name": r.dish.name,
                "customer": {
                    "username": r.customer.username,
                    "avatar": r.customer.avatar.url if r.customer.avatar else None
                }
            })

        return Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get','post'], url_path='reviews')
    def reviews(self, request, pk=None):
        dish = self.get_object()
        if request.method == 'POST':
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Chưa xác thực'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            existing_review = Review.objects.filter(
                dish=dish,
                customer=request.user
            ).first()

            if existing_review:
                # Cập nhật review cũ
                s = serializers.ReviewSerializer(
                    existing_review,
                    data={
                        'rating': request.data.get('rating'),
                        'comment': request.data.get('comment'),
                        'dish': pk,
                    },
                    partial=True
                )
                s.is_valid(raise_exception=True)
                r = s.save()
                return Response(
                    serializers.ReviewSerializer(r).data,
                    status=status.HTTP_200_OK
                )

            s = serializers.ReviewSerializer(data={
                'rating': request.data.get('rating'),
                'comment': request.data.get('comment'),
                'dish': pk,
            })
            s.is_valid(raise_exception=True)
            r = s.save(customer=request.user)
            return Response(
                serializers.ReviewSerializer(r).data,
                status=status.HTTP_201_CREATED
            )
        reviews = Review.objects.filter(dish=dish).select_related('customer').order_by('-created_date')
        p = paginators.DishPaginator()
        page = p.paginate_queryset(reviews, request)
        if page is not None:
            serializer = serializers.ReviewSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)
        return Response(
            serializers.ReviewSerializer(reviews, many=True).data,
            status=status.HTTP_200_OK
        )
    def destroy(self, request, *args, **kwargs):
        dish = self.get_object()
        dish.active = False
        dish.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), perms.IsApprovedChef()]
        return [permissions.AllowAny()]

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

    def get_permissions(self):
        # Chỉ owner mới được sửa/xóa review của mình
        if self.action in ['update', 'partial_update', 'destroy']:
            return [perms.IsReviewOwner()]
        return [permissions.IsAuthenticatedOrReadOnly()]

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
        user = self.request.user
        if user.role == 'CHEF':
            return Order.objects.filter(details__dish__chef=user).distinct().order_by('-created_date')
        else:
            return Order.objects.filter(customer=user).order_by('-created_date')


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

        if order.reservation:
            order.reservation.status = 'CONFIRMED'
            order.reservation.save()

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
                "status": transaction.status
            }, status=status.HTTP_200_OK)

        return Response({"error": "Phương thức thanh toán không hỗ trợ"}, status=status.HTTP_400_BAD_REQUEST)

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





@api_view(['POST'])
def login_proxy(request):

    username = request.data.get("username")
    password = request.data.get("password")
    token_url=request.build_absolute_uri("/o/token/")

    payload = {
        "username": username,
        "password": password,
        "client_id": settings.CLIENT_ID,
        "client_secret": settings.CLIENT_SECRET,
        "grant_type": "password"
    }
    print("👉 URL GỌI ĐẾN:", token_url)
    print("👉 PAYLOAD GỬI ĐI:", payload)

    res = requests.post(token_url, data=payload)
    print("👉 KẾT QUẢ TỪ OAUTH2:", res.text)

    return Response(res.json(), status=res.status_code)


