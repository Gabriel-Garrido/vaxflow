from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
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
    # Otras URLs de tu aplicación si las tienes
    path('api/', include(router.urls)),
    path('docs/', include_docs_urls(title="Inventario API"))    
]