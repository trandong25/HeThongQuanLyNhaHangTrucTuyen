from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls import path
from restaurant.models import Category, Dish, User, Ingredient, Order, Review, Table, Transaction, ChatSession, \
    OrderDetail, Reservation
from django.utils.html import mark_safe
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib import messages
from django.db.models import Count, Sum


class DishAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'category', 'chef','prep_time', 'active', 'image_preview']
    search_fields = ['name']
    list_filter = ['category','active']
    readonly_fields = ['image_preview']
    filter_horizontal = ('ingredients',)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "chef":
            kwargs["queryset"] = User.objects.filter(role='CHEF')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" style="border-radius: 5px;" />')
        return "Chưa có ảnh"

    image_preview.short_description = 'Hình ảnh'

class OrderDetailInline(admin.TabularInline):
    model = OrderDetail
    extra = 0

class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'status', 'total_amount', 'created_date']
    list_filter = ['status']
    search_fields = ['customer__username']
    inlines = [OrderDetailInline, TransactionInline]

class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'table', 'reservation_time', 'number_of_people', 'status']
    list_filter = ['status', 'reservation_time']
    search_fields = ['customer__username', 'table__table_number']


class CustomUserAdmin(DefaultUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_approved']
    list_filter = ['role', 'is_approved', 'is_staff', 'is_active']
    fieldsets = DefaultUserAdmin.fieldsets + (
        ('Thông tin Nhà hàng', {'fields': ('role', 'is_approved', 'phone_number', 'avatar')}),
    )
    actions = ['approve_chefs']

    def approve_chefs(self, request, queryset):
        chefs_to_approve = queryset.filter(role='CHEF', is_approved=False)
        count = chefs_to_approve.update(is_approved=True)
        self.message_user(request, f'Đã duyệt thành công {count} tài khoản Đầu bếp.', level=messages.SUCCESS)

    approve_chefs.short_description = "Duyệt đầu bếp"

class MyAdminSite(admin.AdminSite):
    site_header = 'Hệ thống quản lý bán hàng'
    site_title = 'Trang quản trị'
    index_title = 'Bảng điều khiển'

    def get_urls(self):
        return [
            path('restaurant-stats/', self.admin_view(self.restaurant_stats), name='restaurant_stats'),
        ]+super().get_urls()

    def restaurant_stats(self,request):
        category_stats = Category.objects.annotate(total_dishes=Count('dishes')).values('id', 'name', 'total_dishes')
        revenue_stats = Order.objects.values('status').annotate(total_revenue=Sum('total_amount'))
        reservation_stats = Reservation.objects.values('status').annotate(total=Count('id'))
        reservation_stats_by_date = Reservation.objects.extra(select={'date': 'date(reservation_time)'}).values(
            'date').annotate(total=Count('id')).order_by('date')

        return TemplateResponse(request, 'admin/stats.html', {
            'category_stats': category_stats,
            'revenue_stats': revenue_stats,
            'reservation_stats': reservation_stats,
            'reservation_stats_by_date': reservation_stats_by_date,
        })

admin_site = MyAdminSite()

admin_site.register(Dish, DishAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(Reservation, ReservationAdmin)

admin_site.register(User, CustomUserAdmin)
admin_site.register(Category)
admin_site.register(Ingredient)
admin_site.register(Review)
admin_site.register(Table)
admin_site.register(Transaction)
admin_site.register(ChatSession)
