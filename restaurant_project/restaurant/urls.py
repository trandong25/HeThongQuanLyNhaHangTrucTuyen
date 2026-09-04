from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()

router.register('users',views.UserViewSet,basename='user')
router.register('categories', views.CategoryViewSet, basename='categories')
router.register('dishes', views.DishViewSet,basename='dishes')
router.register('reviews',views.ReviewViewSet,basename='review')
router.register('reservations', views.ReservationViewSet, basename='reservation')
router.register('orders', views.OrderViewSet, basename='order')
router.register('transactions', views.TransactionViewSet)
router.register('stats', views.StatsViewSet,basename='stats')
router.register('compare', views.CompareDishViewSet,basename='compare')
router.register('ingredients', views.IngredientViewSet, basename='ingredent')


urlpatterns = [
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/logout/", views.logout, name="logout"),
    path("", include(router.urls)),
]