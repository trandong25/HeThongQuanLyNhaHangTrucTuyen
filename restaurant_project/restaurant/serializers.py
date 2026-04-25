from rest_framework import serializers
from .models import User,Category,Dish,Review,Ingredient
from .models import Table,Reservation



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name']

class DishSerializer(serializers.ModelSerializer):
    ingredients = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Ingredient.objects.all()
    )

    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'category', 'prep_time', 'image', 'ingredients']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['ingredients'] = IngredientSerializer(instance.ingredients.all(), many=True).data

        if instance.image:
            data['image'] = instance.image.url
        return data



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