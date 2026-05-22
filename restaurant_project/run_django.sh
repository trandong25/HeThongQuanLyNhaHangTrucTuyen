#!/bin/bash
export PYTHONIOENCODING=utf8

echo "=== Cài đặt thư viện từ requirements.txt ==="
pip install -r requirements.txt

echo "=== Thực thi migrate cơ sở dữ liệu ==="
python manage.py makemigrations
python manage.py migrate

echo "=== Tạo superuser (Admin) ==="
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@example.com
export DJANGO_SUPERUSER_PASSWORD=123456

python manage.py createsuperuser --no-input || echo "SuperUser đã tồn tại!"

echo "=== Chèn dữ liệu mẫu cho Nhà hàng ==="
python manage.py shell << EOF

import sys
sys.stdout.reconfigure(encoding='utf-8')

from restaurant.models import Category, Ingredient, Dish, Table
from django.contrib.auth import get_user_model

User = get_user_model()
# CHỈNH SỬA Ở ĐÂY: Dùng luôn admin làm đầu bếp
chef_user = User.objects.filter(username='chef').first()

# 1. Khởi tạo Danh mục (Categories)
c1, _ = Category.objects.get_or_create(name='Món Chính', defaults={'description': 'Món ăn no cho bữa chính'})
c2, _ = Category.objects.get_or_create(name='Món Khai Vị', defaults={'description': 'Món ăn nhẹ kích thích vị giác'})
c3, _ = Category.objects.get_or_create(name='Thức Uống', defaults={'description': 'Các loại nước giải khát và cà phê'})

# 2. Khởi tạo Nguyên liệu (Ingredients)
i1, _ = Ingredient.objects.get_or_create(name='Thịt bò')
i2, _ = Ingredient.objects.get_or_create(name='Bánh phở')
i3, _ = Ingredient.objects.get_or_create(name='Thịt gà')
i4, _ = Ingredient.objects.get_or_create(name='Hành lá')
i5, _ = Ingredient.objects.get_or_create(name='Cam tươi')
i6, _ = Ingredient.objects.get_or_create(name='Thịt heo')
i7, _ = Ingredient.objects.get_or_create(name='Gạo tẻ')
i8, _ = Ingredient.objects.get_or_create(name='Trứng gà')
i9, _ = Ingredient.objects.get_or_create(name='Tôm sú')
i10, _ = Ingredient.objects.get_or_create(name='Tỏi')
i11, _ = Ingredient.objects.get_or_create(name='Rau xà lách')
i12, _ = Ingredient.objects.get_or_create(name='Cà phê hạt')
i13, _ = Ingredient.objects.get_or_create(name='Sữa đặc')

# 3. Khởi tạo Món ăn (Dishes) và nối Nguyên liệu
default_img = 'https://res.cloudinary.com/dxxwcby8l/image/upload/v1709565062/rohn1l6xtpxedyqgyncs.png'

d1, c_d1 = Dish.objects.get_or_create(name='Phở Bò Đặc Biệt', defaults={'description': 'Phở bò truyền thống với nước dùng đậm đà ninh từ xương', 'price': 55000.00, 'prep_time': 10, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d1: d1.ingredients.add(i1, i2, i4)

d2, c_d2 = Dish.objects.get_or_create(name='Gà Nướng Mật Ong', defaults={'description': 'Gà ta nguyên con nướng than hoa phết mật ong', 'price': 150000.00, 'prep_time': 35, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d2: d2.ingredients.add(i3)

d3, c_d3 = Dish.objects.get_or_create(name='Nước Cam Vắt', defaults={'description': 'Nước cam vắt nguyên chất 100% không thêm đường', 'price': 35000.00, 'prep_time': 5, 'category': c3, 'image': default_img, 'chef': chef_user})
if c_d3: d3.ingredients.add(i5)

d4, c_d4 = Dish.objects.get_or_create(name='Cơm Tấm Sườn Bì', defaults={'description': 'Cơm tấm dẻo ăn kèm sườn nướng than và bì chả', 'price': 65000.00, 'prep_time': 15, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d4: d4.ingredients.add(i6, i7, i8)

d5, c_d5 = Dish.objects.get_or_create(name='Gỏi Cuốn Tôm Thịt', defaults={'description': 'Gỏi cuốn tươi ngon với tôm luộc, thịt ba chỉ và rau sống', 'price': 40000.00, 'prep_time': 10, 'category': c2, 'image': default_img, 'chef': chef_user})
if c_d5: d5.ingredients.add(i6, i9, i11)

d6, c_d6 = Dish.objects.get_or_create(name='Bún Chả Hà Nội', defaults={'description': 'Thịt heo nướng thơm lừng ăn kèm bún rối và nước mắm chua ngọt', 'price': 60000.00, 'prep_time': 20, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d6: d6.ingredients.add(i6, i2, i10, i11)

d7, c_d7 = Dish.objects.get_or_create(name='Cơm Chiên Dương Châu', defaults={'description': 'Cơm chiên tơi xốp cùng trứng, tôm và lạp xưởng', 'price': 80000.00, 'prep_time': 15, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d7: d7.ingredients.add(i7, i8, i6, i9, i4)

d8, c_d8 = Dish.objects.get_or_create(name='Phở Gà Ta', defaults={'description': 'Phở gà với nước dùng thanh ngọt tự nhiên', 'price': 50000.00, 'prep_time': 10, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d8: d8.ingredients.add(i3, i2, i4)

d9, c_d9 = Dish.objects.get_or_create(name='Tôm Sú Nướng Bơ Tỏi', defaults={'description': 'Tôm sú tươi nướng kèm sốt bơ tỏi béo ngậy', 'price': 120000.00, 'prep_time': 25, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d9: d9.ingredients.add(i9, i10)

d10, c_d10 = Dish.objects.get_or_create(name='Salad Trộn Trứng', defaults={'description': 'Rau xà lách tươi mát trộn giấm táo và trứng luộc', 'price': 45000.00, 'prep_time': 5, 'category': c2, 'image': default_img, 'chef': chef_user})
if c_d10: d10.ingredients.add(i8, i11)

d11, c_d11 = Dish.objects.get_or_create(name='Cà Phê Sữa Đá', defaults={'description': 'Cà phê pha phin truyền thống hòa quyện cùng sữa đặc', 'price': 25000.00, 'prep_time': 5, 'category': c3, 'image': default_img, 'chef': chef_user})
if c_d11: d11.ingredients.add(i12, i13)

d12, c_d12 = Dish.objects.get_or_create(name='Trà Đá', defaults={'description': 'Trà đá giải khát thanh mát', 'price': 5000.00, 'prep_time': 2, 'category': c3, 'image': default_img, 'chef': chef_user})

d13, c_d13 = Dish.objects.get_or_create(name='Bò Lúc Lắc', defaults={'description': 'Thịt bò xào mềm mọng nước cùng ớt chuông và hành tây', 'price': 130000.00, 'prep_time': 20, 'category': c1, 'image': default_img, 'chef': chef_user})
if c_d13: d13.ingredients.add(i1, i10, i4)

# 4. Khởi tạo Bàn (Tables)
t1, _ = Table.objects.get_or_create(table_number=1, defaults={'capacity': 2})
t2, _ = Table.objects.get_or_create(table_number=2, defaults={'capacity': 4})
t3, _ = Table.objects.get_or_create(table_number=3, defaults={'capacity': 8})
t4, _ = Table.objects.get_or_create(table_number=4, defaults={'capacity': 12})

print("=> Đã chèn dữ liệu mẫu Nhà hàng thành công! Tổng cộng 13 món ăn đã sẵn sàng.")
EOF

echo "=== Chạy server Django ==="
python manage.py runserver
