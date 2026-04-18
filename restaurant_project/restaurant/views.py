from rest_framework.decorators import action
from django.core.serializers import serialize
from rest_framework import viewsets, generics, permissions,status
from .models import Category,Dish
from restaurant import serializers, paginators,perms

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

    @action(methods=['get'], url_path = 'reviews', detail = True)
    def get_reviews(self,request, pk=None):
        dish = self.get_object()
        review = dish.reviews.all()
        from rest_framework.response import Response
        return Response({"message":"Trả về danh sách đánh giá"})