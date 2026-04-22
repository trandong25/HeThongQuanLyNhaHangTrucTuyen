from rest_framework import serializers
from .models import User,Category,Dish,Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DishSerializer(serializers.ModelSerializer):
    ingredients = serializers.StringRelatedField(many=True)

    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'category', 'prep_time', 'image', 'ingredients']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data

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