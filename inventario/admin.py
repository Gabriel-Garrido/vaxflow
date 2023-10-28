from django.contrib import admin
from .models import Vacuna, Vacunatorio, InventarioVacuna, RetiroCamara, TraspasoVacuna, EliminacionVacuna, AdministracionVacuna

admin.site.register(Vacuna)
admin.site.register(Vacunatorio)
admin.site.register(InventarioVacuna)
admin.site.register(RetiroCamara)
admin.site.register(TraspasoVacuna)
admin.site.register(EliminacionVacuna)
admin.site.register(AdministracionVacuna)
