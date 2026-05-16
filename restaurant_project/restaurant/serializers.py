from rest_framework import serializers
from .models import User,Category,Dish,Review,Ingredient,Transaction
from .models import Table,Reservation, OrderDetail, Order
from django.db.models import Avg



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name']

class CompareDishSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'category', 'prep_time', 'image', 'ingredients', 'avg_rating']
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['ingredients'] = IngredientSerializer(instance.ingredients.all(), many=True).data

        if instance.image:
            data['image'] = instance.image.url
        return data
    def get_avg_rating(self, obj):
        return round(obj.reviews.aggregate(avg=Avg('rating'))['avg'] or 0, 1)
    def get_ingredients(self, obj):
        return [i.name for i in obj.ingredients.all()]



class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'avatar', 'role']
        extra_kwargs = {
            'password': {'write_only': True}  # Bảo mật: Mật khẩu chỉ được phép gửi lên để lưu, cấm trả về khi GET
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'comment', 'created_date', 'customer', 'dish']
        extra_kwargs = {
            'dish': {
                'write_only': True
            }
        }
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['customer'] = UserSerializer(instance.customer).data
        return data
    def  validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id','table_number', 'capacity']

class ReservationSerializer(serializers.ModelSerializer):
    customer_name = serializers.StringRelatedField(source='customer', read_only=True)
    table_info = TableSerializer(source='table', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'customer', 'customer_name','table', 'table_info', 'reservation_time', 'number_of_people', 'status','created_date']
        extra_kwargs = {
            'customer': {'read_only':True},
            'status' : {'read_only':True},
            'table': {'write_only': True}
        }

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ['id', 'dish', 'quantity', 'unit_price']
        extra_kwargs = {
            'unit_price': {'read_only':True}
        }

class OrderSerializer(serializers.ModelSerializer):
    order_details = OrderDetailSerializer(many = True, write_only=True)

    class Meta:
        model = Order
        fields = ['id','customer','status','total_amount','created_date','order_details']
        extra_kwargs = {
            'customer': {'read_only': True},
            'status': {'read_only': True},
            'total_amount': {'read_only': True}
        }

    def create(self, validated_data):
        #validate_data từ is_valid(), pop để lấy dữ liêu detail ra và xóa cột đó trong validated
        details_data = validated_data.pop('order_details')

        #request = self.context.get('request'), request.user
        user = self.context['request'].user
        order = Order.objects.create(customer=user, **validated_data)

        total = 0
        for detail in details_data:
            dish = detail['dish']
            quantity = detail['quantity']
            unit_price = dish.price
            total += unit_price*quantity

            OrderDetail.objects.create(
                order=order,
                dish =dish,
                quantity = quantity,
                unit_price = unit_price
            )
        order.total_amount = total
        order.save()

        return order

class DishSerializer(serializers.ModelSerializer):
    ingredients = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Ingredient.objects.all()
    )
    chef = UserSerializer(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'description', 'image',
            'price', 'ingredients', 'prep_time',
            'chef', 'category', 'avg_rating',
            'created_date'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['ingredients'] = IngredientSerializer(instance.ingredients.all(), many=True).data

        if instance.image:
            data['image'] = instance.image.url
        return data
    
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'order', 'amount',
            'payment_method', 'status',
            'transaction_code', 'created_date'
        ]
        read_only_fields = ['status', 'transaction_code']

class DishSearchSerializer(serializers.ModelSerializer):
    avg_rating = serializers.FloatField()
    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'price',
            'prep_time', 'avg_rating'
        ]





