from django.contrib import admin
from .models import Vacunatorio, Vacuna, VacunaStock, TraspasoVacuna, EliminacionVacuna, AdministracionVacuna
from django.utils.translation import gettext_lazy as _

# Define clases de administración personalizadas para tus modelos si es necesario
class VacunaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'lote', 'fecha_caducidad_fabricante')

class VacunaStockAdmin(admin.ModelAdmin):
    list_display = ('tipo_vacuna', 'stock', 'fecha_descongelacion', 'hora_descongelacion', 'fecha_caducidad_descongelacion', 'vacunatorio')

# Registra tus modelos en el panel de administración
admin.site.register(Vacunatorio)
admin.site.register(Vacuna, VacunaAdmin)
admin.site.register(VacunaStock, VacunaStockAdmin)
admin.site.register(TraspasoVacuna)
admin.site.register(EliminacionVacuna)
admin.site.register(AdministracionVacuna)

# Personaliza la apariencia del panel de administración si es necesario
admin.site.site_header = _("Panel de Administración de VaxFlow")
admin.site.site_title = _("VaxFlow Admin")
admin.site.index_title = _("Bienvenido al Panel de Administración de VaxFlow")
