from rest_framework import pagination

class DishPaginator(pagination.PageNumberPagination):
    page_size = 20

class ReviewPaginator(pagination.PageNumberPagination):
    page_size = 5

class OrderPaginator(pagination.PageNumberPagination):
    page_size = 10
