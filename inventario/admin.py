from django.contrib import admin
from .models import Vacunatorio, Vacuna, VacunaStock, TraspasoVacuna, EliminacionVacuna, AdministracionVacuna, RetiroCamara, RegistroInventario
from django.utils.translation import gettext_lazy as _

# Define clases de administración personalizadas para tus modelos si es necesario
class VacunaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'lote', 'fecha_caducidad_fabricante')

class VacunaStockAdmin(admin.ModelAdmin):
    list_display = ('tipo_vacuna', 'stock', 'fecha_descongelacion', 'hora_descongelacion', 'fecha_caducidad_descongelacion', 'vacunatorio')

class RegistroInventarioAdmin(admin.ModelAdmin):
    list_display = ('vacuna_stock', 'fecha', 'stock_inicial', 'stock_final')

class TraspasoVacunaAdmin(admin.ModelAdmin):
    list_display = ('vacuna_traspaso', 'vacunatorio_origen', 'vacunatorio_destino', 'fecha_traspaso', 'cantidad_traspasada')

class EliminacionVacunaAdmin(admin.ModelAdmin):
    list_display = ('vacuna', 'fecha', 'cantidad_eliminada', 'responsable_eliminacion', 'motivo_eliminacion', 'vacunatorio_eliminacion')

class AdministracionVacunaAdmin(admin.ModelAdmin):
    list_display = ('vacuna', 'fecha', 'cantidad_administrada')

class RetiroCamaraAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'cantidad_retirada', 'vacunatorio_retiro')

# Registra tus modelos en el panel de administración
admin.site.register(Vacunatorio)
admin.site.register(Vacuna, VacunaAdmin)
admin.site.register(VacunaStock, VacunaStockAdmin)
admin.site.register(RegistroInventario, RegistroInventarioAdmin)
admin.site.register(TraspasoVacuna, TraspasoVacunaAdmin)
admin.site.register(EliminacionVacuna, EliminacionVacunaAdmin)
admin.site.register(AdministracionVacuna, AdministracionVacunaAdmin)
admin.site.register(RetiroCamara, RetiroCamaraAdmin)
# Personaliza la apariencia del panel de administración si es necesario
admin.site.site_header = _("Panel de Administración de VaxFlow")
admin.site.site_title = _("VaxFlow Admin")
admin.site.index_title = _("Bienvenido al Panel de Administración de VaxFlow")
