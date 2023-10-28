from rest_framework import routers
from django.urls import path, include
from .views import VacunaViewSet, VacunatorioViewSet, InventarioVacunaViewSet, RetiroCamaraViewSet, TraspasoVacunaViewSet, EliminacionVacunaViewSet, AdministracionVacunaViewSet

router = routers.DefaultRouter()
router.register(r'vacunas', VacunaViewSet)
router.register(r'vacunatorios', VacunatorioViewSet)
router.register(r'inventario-vacuna', InventarioVacunaViewSet)
router.register(r'retiro-camara', RetiroCamaraViewSet)
router.register(r'traspaso-vacuna', TraspasoVacunaViewSet)
router.register(r'eliminacion-vacuna', EliminacionVacunaViewSet)
router.register(r'administracion-vacuna', AdministracionVacunaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
