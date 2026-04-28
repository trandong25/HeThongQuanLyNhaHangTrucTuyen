from rest_framework import serializers
from django.db.models import Avg
from .models import User, Category, Dish, Review, Transaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CompareDishSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'prep_time', 'avg_rating', 'ingredients']
    def get_avg_rating(self, obj):
        return round(obj.reviews.aggregate(avg=Avg('rating'))['avg'] or 0, 1)
    def get_ingredients(self, obj):
        return [i.name for i in obj.ingredients.all()]

class UserSerializer(serializers.ModelSerializer):
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


class DishSerializer(serializers.ModelSerializer):
    ingredients = serializers.StringRelatedField(many=True)
    chef = UserSerializer(read_only=True)
    avg_rating = serializers.FloatField()
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
        if instance.image:
            data['image'] = instance.image.url
        return data


class ReviewSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField(many=False)
    dish = serializers.StringRelatedField(many=False)
    class Meta:
        model = Review
        fields = '__all__'

    def  validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


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







