from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # Importa el modelo de usuario personalizado
from inventario.models import Vacunatorio

# Define una clase CustomUserAdmin que personaliza la vista de administración de usuarios
class CustomUserAdmin(UserAdmin):
    # Muestra estas columnas en la lista de usuarios en el panel de administración
    list_display = ('username', 'name', 'last_name', 'vacunatorio', 'is_staff', 'is_superuser' )
    
    # Agrega filtros para las columnas de grupos y vacunatorio en el panel de administración
    list_filter = ('groups', 'vacunatorio', 'is_staff', 'is_superuser')
    
    # Define secciones y campos en la vista de detalle del usuario en el panel de administración
    fieldsets = (
        ('Personal Info', {'fields': ('username', 'password', 'email', 'rut', 'vacunatorio', 'name', 'last_name', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )
    
    # Define los campos que se mostrarán al agregar un nuevo usuario en el panel de administración
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username','rut', 'name', 'last_name','email', 'phone', 'vacunatorio', 'password1', 'password2', 'groups'),
        }),
    )

# Registra el modelo CustomUser con la configuración personalizada en el panel de administración
admin.site.register(CustomUser, CustomUserAdmin)
