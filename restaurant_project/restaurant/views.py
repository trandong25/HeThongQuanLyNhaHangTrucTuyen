from django.db.models.functions import TruncDay
from oauthlib.uri_validate import query
from rest_framework.decorators import action
from rest_framework import viewsets, generics, permissions
from rest_framework.permissions import IsAuthenticated

from .models import *
from . import serializers, paginators,perms
from .serializers import CompareDishSerializer
from rest_framework.response import Response
from django.db.models import  Sum, Avg, F


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.filter(active = True)
    serializer_class = serializers.CategorySerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.filter(active =True)
    serializer_class = serializers.DishSerializer
    pagination_class = paginators.DishPaginator

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsApprovedChef()]
        return [permissions.AllowAny()]

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
