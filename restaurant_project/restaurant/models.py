from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField

class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract =True

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN','Admin'),
        ('CHEF','Chef'),
        ('CUSTOMER','Customer')
    ]
    avatar = CloudinaryField(null =True)
    phone_number = models.CharField(max_length=15, null = True, blank=True)
    role = models.CharField(max_length=10, choices= ROLE_CHOICES, default="CUSTOMER")
    is_approved = models.BooleanField(default=False)

class Category(BaseModel):
    name = models.CharField(max_length=150)
    description = models.TextField(null=True,blank=True)

    def __str__(self):
        return self.name

class Ingredient(BaseModel):
    name = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name

class Dish(BaseModel):
    chef = models.ForeignKey(User,null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = RichTextField()
    image = CloudinaryField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    ingredients = models.ManyToManyField(Ingredient,related_name='dishes')
    prep_time = models.IntegerField(help_text="Thời gian chuẩn bị (phút)")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,null=True, related_name='dishes')

    class Meta:
        unique_together = ('name', 'category')

    def __str__(self):
        return self.name

class Review(BaseModel):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=5.0)
    comment = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('dish','customer')

    def __str__(self):
        return f"Review {self.rating} sao của {self.customer.username} cho món {self.dish.name}"

class Table(BaseModel):
    table_number = models.IntegerField(unique=True)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Bàn số {self.table_number} - {self.capacity} người"

class Reservation(BaseModel):
    RESERVATION_STATUS = [
        ('PENDING', 'Chờ duyệt'),
        ('CONFIRMED', 'Đã xác nhận'),
        ('CANCELLED', 'Đã hủy')
    ]
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True,blank=True)
    reservation_time = models.DateTimeField()
    number_of_people = models.IntegerField()
    status = models.CharField(max_length=15, choices=RESERVATION_STATUS, default='PENDING')

    def __str__(self):
        return f"Đặt bàn: {self.customer.username} - {self.reservation_time}"

class Order(BaseModel):
    ORDER_STATUS = [
        ('PENDING','Chờ xác nhận'),
        ('DONE', "Hoàn thành"),
        ('CANCELLED', 'Đã hủy')
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    reservation = models.ForeignKey(Reservation,on_delete=models.SET_NULL, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12,decimal_places=2,default=0)
    status = models.CharField(max_length=15,choices=ORDER_STATUS,default='PENDING')


    def __str__(self):
        return f"Đơn hàng #{self.id} - {self.customer.username})"

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='details')
    dish = models.ForeignKey(Dish, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.dish.name} - {self.quantity}"

class Transaction(BaseModel):
    PAYMENT_METHODS = [
        ('CASH', 'Tiền mặt'),
        ('PAYPAL', 'PayPal'),
        ('MOMO', 'MoMo'),
        ('ZALOPAY', 'ZaloPay'),
        ('STRIPE', 'Stripe')
    ]
    TRANSACTION_STATUS = [
        ('PENDING', 'Đang xử lý'),
        ('SUCCESS', 'Thành công'),
        ('FAILED', 'Thất bại'),
    ]
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=10, choices=TRANSACTION_STATUS, default='PENDING')
    transaction_code = models.CharField(max_length=100, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Giao dịch #{self.id} - {self.amount} ({self.get_status_display()})"


class ChatSession(BaseModel):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_chats')
    chef = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chef_chats')

    class Meta:
        unique_together = ('customer', 'chef')

    def __str__(self):
        return f"Chat: Khách {self.customer.username} & Bếp {self.chef.username}"