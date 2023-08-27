from django.contrib import admin
from .models import AdministracionVacuna, Vacuna, Vacunatorio, TraspasoVacuna, EliminacionVacuna, VacunaStock

# Register your models here.
admin.site.register(AdministracionVacuna)
admin.site.register(Vacuna)
admin.site.register(Vacunatorio)
admin.site.register(TraspasoVacuna)
admin.site.register(EliminacionVacuna)
admin.site.register(VacunaStock)