from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='categories')
router.register('dishes', views.DishViewSet,basename='dishes')



urlpatterns = [
    path('', include(router.urls))
]