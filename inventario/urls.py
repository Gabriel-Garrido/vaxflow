from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from .views import VacunatorioViewSet, VacunaViewSet, AdministracionVacunaViewSet, TraspasoVacunaViewSet, EliminacionVacunaViewSet, VacunaStockViewSet, UsuariosByVacunatorioView

router = routers.DefaultRouter()
router.register(r'vacunatorios', VacunatorioViewSet)
router.register(r'vacunas', VacunaViewSet)
router.register(r'vacunasStock', VacunaStockViewSet)
router.register(r'administraciones', AdministracionVacunaViewSet)
router.register(r'traspasos', TraspasoVacunaViewSet)
router.register(r'eliminaciones', EliminacionVacunaViewSet)

urlpatterns = [
    # Otras URLs de tu aplicación si las tienes
    path('api/', include(router.urls)),
    path('docs/', include_docs_urls(title="Inventario API")),
    path('api/usuarios/vacunatorio/<int:vacunatorio_id>/', UsuariosByVacunatorioView.as_view(), name='usuarios-por-vacunatorio'),
]