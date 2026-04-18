from rest_framework import pagination

class DishPaginator(pagination.PageNumberPagination):
    page_size = 12

class ReviewPaginator(pagination.PageNumberPagination):
    page_size = 5

class OrderPaginator(pagination.PageNumberPagination):
    page_size = 10
