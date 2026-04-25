from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='category')
router.register('dishes', views.DishViewSet,basename='dish')
router.register('users',views.UserViewSet,basename='user')
router.register('reviews',views.ReviewViewSet,basename='review')
router.register('reservations', views.ReservationViewSet, basename='reservation')

urlpatterns = [
    path('', include(router.urls))
]