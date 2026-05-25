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
python manage.py shell << 'EOF'
import sys
sys.stdout.reconfigure(encoding='utf-8')

from restaurant.models import Category, Ingredient, Dish, Table
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

# 0. Users
admin_user, _ = User.objects.get_or_create(username='admin_boss', defaults={
    'email': 'admin_boss@example.com', 'password': make_password('123456'),
    'role': 'ADMIN', 'is_approved': True, 'is_superuser': True, 'is_staff': True
})

chef1, _ = User.objects.get_or_create(username='chefDong', defaults={
    'email': 'dong@restaurant.com', 'password': make_password('Abc@123'),
    'first_name': 'Đồng', 'last_name': 'Trần', 'role': 'CHEF', 'is_approved': True
})

chef2, _ = User.objects.get_or_create(username='chefDuc', defaults={
    'email': 'duc@restaurant.com', 'password': make_password('Abc@123'),
    'first_name': 'Đức', 'last_name': 'Lê', 'role': 'CHEF', 'is_approved': True
})

chef_pending, _ = User.objects.get_or_create(username='chefC', defaults={
    'email': 'newbie@restaurant.com', 'password': make_password('123456'),
    'first_name': 'Newbie', 'last_name': 'Cook', 'role': 'CHEF', 'is_approved': False
})

customer1, _ = User.objects.get_or_create(username='customer', defaults={
    'email': 'john@example.com', 'password': make_password('Abc@123'),
    'first_name': 'John', 'last_name': 'Doe', 'role': 'CUSTOMER', 'is_approved': True
})

# 1. Categories
c1, _ = Category.objects.get_or_create(name='Món Chính', defaults={'description': 'Món ăn no cho bữa chính'})
c2, _ = Category.objects.get_or_create(name='Món Khai Vị', defaults={'description': 'Món ăn nhẹ kích thích vị giác'})
c3, _ = Category.objects.get_or_create(name='Thức Uống', defaults={'description': 'Các loại nước giải khát và cà phê'})
c4, _ = Category.objects.get_or_create(name='Tráng Miệng', defaults={'description': 'Món ngọt sau bữa ăn'})
c5, _ = Category.objects.get_or_create(name='Món Chay', defaults={'description': 'Thanh đạm, tốt cho sức khỏe'})

# 2. Ingredients
ingredients_list = [
    'Thịt bò', 'Bánh phở', 'Thịt gà', 'Hành lá', 'Cam tươi',
    'Thịt heo', 'Gạo tẻ', 'Trứng gà', 'Tôm sú', 'Tỏi',
    'Rau xà lách', 'Cà phê hạt', 'Sữa đặc', 'Cá hồi', 'Cà chua',
    'Phô mai', 'Bột mì', 'Đường', 'Sữa tươi', 'Chanh leo',
    'Nấm rơm', 'Đậu phụ', 'Rau thơm', 'Gừng', 'Ớt chuông', 'Khoai tây', 'Trà',
    'Đào', 'Bột'
]
ingredient_objs = {}
for ing_name in ingredients_list:
    obj, _ = Ingredient.objects.get_or_create(name=ing_name)
    ingredient_objs[ing_name] = obj

def get_ings(*names):
    return [ingredient_objs[name] for name in names]

# 3. Dishes (mảng đã được kiểm tra đầy đủ)
default_img = 'https://res.cloudinary.com/dxxwcby8l/image/upload/v1709565062/rohn1l6xtpxedyqgyncs.png'

dishes_data = [
    {'name': 'Phở Bò Đặc Biệt', 'desc': 'Phở bò truyền thống với nước dùng đậm đà', 'price': 55000, 'prep': 10, 'cat': c1, 'chef': chef1, 'ings': ['Thịt bò', 'Bánh phở', 'Hành lá'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779633431/b804340e-f08d-4673-a7d6-df4b0fe58088.png'},
    {'name': 'Gà Nướng Mật Ong', 'desc': 'Gà ta nguyên con nướng than hoa', 'price': 150000, 'prep': 35, 'cat': c1, 'chef': chef2, 'ings': ['Thịt gà', 'Tỏi', 'Đường'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779633662/50d1c80e-e7d8-43a2-b2d9-b44ed73c18e2.png'},
    {'name': 'Cơm Tấm Sườn Bì', 'desc': 'Cơm tấm dẻo ăn kèm sườn nướng than', 'price': 65000, 'prep': 15, 'cat': c1, 'chef': chef1, 'ings': ['Thịt heo', 'Gạo tẻ', 'Trứng gà'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779633748/d55f733a-93c3-4f07-b588-eb6a06753868.png'},
    {'name': 'Bún Chả Hà Nội', 'desc': 'Thịt heo nướng thơm lừng ăn kèm bún', 'price': 60000, 'prep': 20, 'cat': c1, 'chef': chef2, 'ings': ['Thịt heo', 'Bánh phở', 'Tỏi', 'Rau xà lách'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779633808/9049fc48-34ff-453f-9cdb-903c4a250053.png'},
    {'name': 'Cơm Chiên Dương Châu', 'desc': 'Cơm chiên tơi xốp cùng trứng, tôm', 'price': 80000, 'prep': 15, 'cat': c1, 'chef': chef1, 'ings': ['Gạo tẻ', 'Trứng gà', 'Thịt heo', 'Tôm sú', 'Hành lá'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779633902/a7c9b0d0-3472-468b-9f00-62b04f5791d2.png'},
    {'name': 'Phở Gà Ta', 'desc': 'Phở gà với nước dùng thanh ngọt tự nhiên', 'price': 50000, 'prep': 10, 'cat': c1, 'chef': chef1, 'ings': ['Thịt gà', 'Bánh phở', 'Hành lá'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634021/919f7731-3cf9-4504-98de-fd07ea6771f4.png'},
    {'name': 'Tôm Sú Nướng Bơ Tỏi', 'desc': 'Tôm sú tươi nướng kèm sốt bơ tỏi', 'price': 120000, 'prep': 25, 'cat': c1, 'chef': chef2, 'ings': ['Tôm sú', 'Tỏi'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634094/8208cfa5-dd23-4417-893e-cfd12af272e4.png'},
    {'name': 'Bò Lúc Lắc', 'desc': 'Thịt bò xào mềm mọng nước cùng ớt chuông', 'price': 130000, 'prep': 20, 'cat': c1, 'chef': chef1, 'ings': ['Thịt bò', 'Tỏi', 'Ớt chuông'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634204/662c6961-0cba-4067-a541-a1b8b993145e.png'},
    {'name': 'Cá Hồi Áp Chảo', 'desc': 'Cá hồi Na Uy áp chảo sốt chanh dây', 'price': 180000, 'prep': 20, 'cat': c1, 'chef': chef2, 'ings': ['Cá hồi', 'Chanh leo', 'Tỏi'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634247/ca-hoi-ap-chao-sot-bo-toi-1_de948eb91375487d9ab74d439edc694b_grande_xuihbs.jpg'},
    {'name': 'Mì Ý Sốt Bò Băm', 'desc': 'Mì Ý truyền thống sốt cà chua thịt bò', 'price': 95000, 'prep': 15, 'cat': c1, 'chef': chef2, 'ings': ['Bột mì', 'Thịt bò', 'Cà chua', 'Tỏi'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634269/my-y-spaghetti-sot-bo-bam_ncdowa.jpg'},
    {'name': 'Steak Bò Mỹ', 'desc': 'Thăn ngoại bò Mỹ nướng mềm', 'price': 250000, 'prep': 20, 'cat': c1, 'chef': chef1, 'ings': ['Thịt bò', 'Tỏi', 'Rau xà lách'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634368/steak-bo-m-s-t-vang-d_ztebif.jpg'},
    {'name': 'Gà Sốt Phô Mai', 'desc': 'Gà rán giòn phủ xốt phô mai Hàn Quốc', 'price': 140000, 'prep': 25, 'cat': c1, 'chef': chef2, 'ings': ['Thịt gà', 'Phô mai', 'Bột mì'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634405/xcach-lam-ga-ran-pho-mai-han-quoc-tai-nha-sieu-don-gian-01.jpg.pagespeed.ic_.foqMH5Z8BR_pfm1bf.jpg'},
    {'name': 'Gỏi Cuốn Tôm Thịt', 'desc': 'Gỏi cuốn tươi ngon với tôm luộc, thịt', 'price': 40000, 'prep': 10, 'cat': c2, 'chef': chef1, 'ings': ['Thịt heo', 'Tôm sú', 'Rau xà lách'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634421/hq720_d88usm.jpg'},
    {'name': 'Salad Trộn Trứng', 'desc': 'Rau xà lách tươi mát trộn giấm táo', 'price': 45000, 'prep': 5, 'cat': c2, 'chef': chef2, 'ings': ['Trứng gà', 'Rau xà lách', 'Cà chua'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634443/cach-lam-salad-rau-cu-tron-trung-mon-khai-vi-592267012183_r2mfuv.jpg'},
    {'name': 'Súp Gà Nấm', 'desc': 'Súp gà xé phay cùng nấm hương', 'price': 35000, 'prep': 10, 'cat': c2, 'chef': chef1, 'ings': ['Thịt gà', 'Nấm rơm'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634465/sup-ga-moc-nam-huong_ui4qxh.jpg'},
    {'name': 'Khoai Tây Chiên Bơ', 'desc': 'Khoai tây chiên giòn xóc bơ tỏi', 'price': 30000, 'prep': 10, 'cat': c2, 'chef': chef2, 'ings': ['Tỏi', 'Khoai tây'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634485/Vb_ROIF_pidozj.jpg'},
    {'name': 'Salad Cá Hồi', 'desc': 'Cá hồi xông khói trộn rau củ quả', 'price': 85000, 'prep': 10, 'cat': c2, 'chef': chef1, 'ings': ['Cá hồi', 'Rau xà lách', 'Cà chua'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634505/hq720_ncnlwu.jpg'},
    {'name': 'Đậu Hũ Chiên Giòn', 'desc': 'Đậu hũ non tẩm bột chiên xù', 'price': 25000, 'prep': 8, 'cat': c2, 'chef': chef2, 'ings': ['Đậu phụ', 'Bột mì'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634523/hq720_yey8z0.jpg'},
    {'name': 'Nước Cam Vắt', 'desc': 'Nước cam vắt nguyên chất 100%', 'price': 35000, 'prep': 5, 'cat': c3, 'chef': chef1, 'ings': ['Cam tươi', 'Đường'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634563/nuocscam-620x620_e75jto.jpg'},
    {'name': 'Cà Phê Sữa Đá', 'desc': 'Cà phê pha phin truyền thống', 'price': 25000, 'prep': 5, 'cat': c3, 'chef': chef1, 'ings': ['Cà phê hạt', 'Sữa đặc'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634667/Vietnamese-iced-coffee-with-condensed-milk-recipe_can212.jpg'},
    {'name': 'Trà Đá', 'desc': 'Trà đá giải khát thanh mát', 'price': 5000, 'prep': 2, 'cat': c3, 'chef': chef2, 'ings': ['Trà'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634639/vietnamese-iced-tea-01_1702194212_dc9syg.jpg'},
    {'name': 'Sinh Tố Chanh Dây', 'desc': 'Sinh tố chanh dây chua ngọt mát lạnh', 'price': 40000, 'prep': 5, 'cat': c3, 'chef': chef2, 'ings': ['Chanh leo', 'Đường', 'Sữa đặc'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634703/sinh-to-chanh-day_dtok2u.jpg'},
    {'name': 'Trà Đào Cam Sả', 'desc': 'Trà đào thanh lọc cơ thể', 'price': 45000, 'prep': 5, 'cat': c3, 'chef': chef1, 'ings': ['Đào', 'Đường'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634719/tra-dao-cam-sa-ngot-ngao_eqcsge.jpg'},
    {'name': 'Nước Ép Cà Chua', 'desc': 'Nước ép cà chua tươi', 'price': 30000, 'prep': 5, 'cat': c3, 'chef': chef2, 'ings': ['Cà chua', 'Đường'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634737/photo-1728372741509-17283727430901418215071_ph6yxi.jpg'},
    {'name': 'Bánh Flan', 'desc': 'Bánh flan caramen béo ngậy', 'price': 20000, 'prep': 5, 'cat': c4, 'chef': chef1, 'ings': ['Trứng gà', 'Sữa tươi', 'Đường'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634759/cach-lam-banh-flan-bang-noi-chien-khong-dau-1-1_mw3oqx.jpg'},
    {'name': 'Chè Khúc Bạch', 'desc': 'Chè ngọt thanh mát lạnh', 'price': 35000, 'prep': 5, 'cat': c4, 'chef': chef2, 'ings': ['Sữa tươi', 'Bột', 'Đường'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634783/vn-11134207-7qukw-li9xvxun4xxu09_qlmmor.jpg'},
    {'name': 'Kem Cuộn', 'desc': 'Kem tươi cuộn vị vani', 'price': 30000, 'prep': 5, 'cat': c4, 'chef': chef1, 'ings': ['Sữa tươi', 'Sữa đặc'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634809/a47134b3-5f0d-4ab6-9e23-ebe902421381j1xmtq9p_whcxhs.jpg'},
    {'name': 'Đậu Hũ Tứ Xuyên', 'desc': 'Đậu hũ xào cay nồng', 'price': 45000, 'prep': 15, 'cat': c5, 'chef': chef2, 'ings': ['Đậu phụ', 'Ớt chuông', 'Tỏi'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634840/thanh-pham-70_myssia.jpg'},
    {'name': 'Nấm Kho Tiêu', 'desc': 'Nấm đùi gà kho tiêu đậm đà', 'price': 50000, 'prep': 20, 'cat': c5, 'chef': chef1, 'ings': ['Nấm rơm', 'Tỏi'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779635545/sddefault_gwuwnc.jpg'},
    {'name': 'Canh Rong Biển Đậu Hũ', 'desc': 'Canh rong biển đậu hũ non', 'price': 35000, 'prep': 10, 'cat': c5, 'chef': chef2, 'ings': ['Đậu phụ'], 'img':'https://res.cloudinary.com/dhao6ky98/image/upload/v1779634885/canh-rong-bien-dau-hu-mon-chay-thanh-dam-de-nau-4_ejbadn.png'},
]

for d in dishes_data:
    dish_image = d.get('img', default_img)
    dish_obj, created = Dish.objects.get_or_create(
        name=d['name'],
        category=d['cat'],
        defaults={
            'description': d['desc'],
            'price': d['price'],
            'prep_time': d['prep'],
            'chef': d['chef'],
            'image': dish_image
        }
    )
    if not created:
        dish_obj.image = dish_image
        dish_obj.save()
    if created and d['ings']:
        dish_obj.ingredients.add(*get_ings(*d['ings']))

# 4. Tables
Table.objects.get_or_create(table_number=1, defaults={'capacity': 2})
Table.objects.get_or_create(table_number=2, defaults={'capacity': 4})
Table.objects.get_or_create(table_number=3, defaults={'capacity': 8})
Table.objects.get_or_create(table_number=4, defaults={'capacity': 12})
Table.objects.get_or_create(table_number=5, defaults={'capacity': 2})
Table.objects.get_or_create(table_number=6, defaults={'capacity': 4})

print("=> Đã chèn dữ liệu mẫu Nhà hàng thành công!")
print("   - Tạo 1 Admin, 2 Chef đã duyệt, 1 Chef chờ duyệt, 1 Customer.")
print("   - Tổng cộng 30 món ăn với nguyên liệu tương ứng đã sẵn sàng.")
EOF

echo "=== Chạy server Django ==="
python manage.py runserver