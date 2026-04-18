#!/bin/bash

echo "=== Cài đặt thư viện từ requirements.txt ==="
pip install -r requirements.txt

echo "=== Thực thi migrate cơ sở dữ liệu ==="
python manage.py makemigrations
python manage.py migrate

echo "=== Tạo superuser (Admin) ==="
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@example.com
export DJANGO_SUPERUSER_PASSWORD=Admin@123

python manage.py createsuperuser --no-input || echo "SuperUser đã tồn tại!"

echo "=== Chèn dữ liệu mẫu cho Nhà hàng ==="
python manage.py shell <<EOF
from restaurant.models import Category, Ingredient, Dish, Table

# 1. Create Category data
c1, _ = Category.objects.get_or_create(name='Main Course', description='Filling dishes for the main meal')
c2, _ = Category.objects.get_or_create(name='Appetizer', description='Light dishes to stimulate taste buds')
c3, _ = Category.objects.get_or_create(name='Beverage', description='Various kinds of drinks')

# 2. Create Ingredient data
i1, _ = Ingredient.objects.get_or_create(name='Beef')
i2, _ = Ingredient.objects.get_or_create(name='Pho noodles')
i3, _ = Ingredient.objects.get_or_create(name='Chicken')
i4, _ = Ingredient.objects.get_or_create(name='Green onion')
i5, _ = Ingredient.objects.get_or_create(name='Fresh orange')

# 3. Create Dish data and add Ingredients (Many-to-Many)
# Dish 1: Beef Pho
d1, created1 = Dish.objects.get_or_create(
    name='Special Beef Pho',
    defaults={
        'description': 'Traditional beef pho with rich broth',
        'price': 55000.00,
        'prep_time': 10,
        'category': c1,
        'image': 'https://res.cloudinary.com/dxxwcby8l/image/upload/v1709565062/rohn1l6xtpxedyqgyncs.png'
    }
)
if created1:
    d1.ingredients.add(i1, i2, i4)
    d1.save()

# Dish 2: Grilled Chicken
d2, created2 = Dish.objects.get_or_create(
    name='Honey Grilled Chicken',
    defaults={
        'description': 'Whole free-range chicken grilled over charcoal',
        'price': 150000.00,
        'prep_time': 35,
        'category': c1,
        'image': 'https://res.cloudinary.com/dxxwcby8l/image/upload/v1709565062/rohn1l6xtpxedyqgyncs.png'
    }
)
if created2:
    d2.ingredients.add(i3)
    d2.save()

# Dish 3: Orange Juice
d3, created3 = Dish.objects.get_or_create(
    name='Fresh Orange Juice',
    defaults={
        'description': '100% pure squeezed orange without sugar',
        'price': 35000.00,
        'prep_time': 5,
        'category': c3,
        'image': 'https://res.cloudinary.com/dxxwcby8l/image/upload/v1709565062/rohn1l6xtpxedyqgyncs.png'
    }
)
if created3:
    d3.ingredients.add(i5)
    d3.save()

# 4. Create Table data
t1, _ = Table.objects.get_or_create(table_number=1, defaults={'capacity': 2})
t2, _ = Table.objects.get_or_create(table_number=2, defaults={'capacity': 4})
t3, _ = Table.objects.get_or_create(table_number=3, defaults={'capacity': 8})
t4, _ = Table.objects.get_or_create(table_number=4, defaults={'capacity': 12})

print("=> Đã chèn dữ liệu mẫu Nhà hàng thành công!")
EOF

echo "=== Chạy server Django ==="
python manage.py runserver