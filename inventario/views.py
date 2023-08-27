from rest_framework import viewsets
from .models import Vacunatorio, Vacuna, AdministracionVacuna, TraspasoVacuna, EliminacionVacuna, VacunaStock
from .serializer import VacunatorioSerializer, VacunaSerializer, AdministracionVacunaSerializer, TraspasoVacunaSerializer, EliminacionVacunaSerializer, VacunaStockSerializer

class VacunatorioViewSet(viewsets.ModelViewSet):
    queryset = Vacunatorio.objects.all()
    serializer_class = VacunatorioSerializer

class VacunaStockViewSet(viewsets.ModelViewSet):
    queryset = VacunaStock.objects.all()
    serializer_class = VacunaStockSerializer

class VacunaViewSet(viewsets.ModelViewSet):
    queryset = Vacuna.objects.all()
    serializer_class = VacunaSerializer

class AdministracionVacunaViewSet(viewsets.ModelViewSet):
    queryset = AdministracionVacuna.objects.all()
    serializer_class = AdministracionVacunaSerializer

class TraspasoVacunaViewSet(viewsets.ModelViewSet):
    queryset = TraspasoVacuna.objects.all()
    serializer_class = TraspasoVacunaSerializer

class EliminacionVacunaViewSet(viewsets.ModelViewSet):
    queryset = EliminacionVacuna.objects.all()
    serializer_class = EliminacionVacunaSerializer