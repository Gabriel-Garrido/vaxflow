from rest_framework import viewsets
from .models import Vacuna, Vacunatorio, InventarioVacuna, RetiroCamara, TraspasoVacuna, EliminacionVacuna, AdministracionVacuna
from .serializer import VacunaSerializer, VacunatorioSerializer, InventarioVacunaSerializer, RetiroCamaraSerializer, TraspasoVacunaSerializer, EliminacionVacunaSerializer, AdministracionVacunaSerializer

class VacunaViewSet(viewsets.ModelViewSet):
    queryset = Vacuna.objects.all()
    serializer_class = VacunaSerializer

class VacunatorioViewSet(viewsets.ModelViewSet):
    queryset = Vacunatorio.objects.all()
    serializer_class = VacunatorioSerializer

class InventarioVacunaViewSet(viewsets.ModelViewSet):
    queryset = InventarioVacuna.objects.all()
    serializer_class = InventarioVacunaSerializer

class RetiroCamaraViewSet(viewsets.ModelViewSet):
    queryset = RetiroCamara.objects.all()
    serializer_class = RetiroCamaraSerializer

class TraspasoVacunaViewSet(viewsets.ModelViewSet):
    queryset = TraspasoVacuna.objects.all()
    serializer_class = TraspasoVacunaSerializer

class EliminacionVacunaViewSet(viewsets.ModelViewSet):
    queryset = EliminacionVacuna.objects.all()
    serializer_class = EliminacionVacunaSerializer

class AdministracionVacunaViewSet(viewsets.ModelViewSet):
    queryset = AdministracionVacuna.objects.all()
    serializer_class = AdministracionVacunaSerializer
