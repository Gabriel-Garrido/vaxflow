from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from inventario.models import Vacunatorio

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'rut', 'vacunatorio', 'name', 'last_name', 'phone')
    list_filter = ('groups', 'vacunatorio')
    fieldsets = (
        ('Personal Info', {'fields': ('username', 'password', 'email', 'rut', 'vacunatorio', 'name', 'last_name', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'rut', 'vacunatorio', 'name', 'last_name', 'phone', 'groups', 'password1', 'password2'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
