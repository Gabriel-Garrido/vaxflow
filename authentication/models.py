from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    ROL_CHOICES = [
        ('encargado', 'Encargado de Vacunatorio'),
        ('referente', 'Referente de Salud'),
        ('vacunador', 'Vacunador'),
    ]

    rut = models.CharField(max_length=12, unique=True)
    vacunatorio = models.ForeignKey('inventario.Vacunatorio', on_delete=models.SET_NULL, null=True, blank=True)
    tipo_usuario = models.CharField(max_length=10, choices=ROL_CHOICES, default='vacunador')

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name='customuser_set'
    )

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='customuser_set'
    )


    def __str__(self):
        return self.username
