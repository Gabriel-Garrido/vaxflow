from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _
from inventario.models import Vacunatorio


class CustomUser(AbstractUser):

    rut = models.CharField(max_length=12, unique=True)
    name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=20)
    vacunatorio = models.ForeignKey(Vacunatorio, on_delete=models.SET_NULL, null=True, blank=False)
    email = models.EmailField(_("email"), max_length=254, blank=False)

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=False,
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
