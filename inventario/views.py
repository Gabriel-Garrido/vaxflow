from rest_framework import viewsets
from .models import Vacunatorio, Vacuna, AdministracionVacuna, TraspasoVacuna, EliminacionVacuna, VacunaStock
from .serializer import VacunatorioSerializer, VacunaSerializer, AdministracionVacunaSerializer, TraspasoVacunaSerializer, EliminacionVacunaSerializer, VacunaStockSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from authentication.serializers import CustomUserSerializer
from rest_framework.response import Response
from rest_framework import status

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

class UsuariosByVacunatorioView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        vacunatorio_id = self.kwargs.get('vacunatorio_id')
        return CustomUser.objects.filter(vacunatorio_id=vacunatorio_id)
    
class GetAllTraspasosView(generics.ListAPIView):
    queryset = TraspasoVacuna.objects.all()
    serializer_class = TraspasoVacunaSerializer

class getAllEliminacionesView(generics.ListAPIView):
    queryset = EliminacionVacuna.objects.all()
    serializer_class = EliminacionVacunaSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class getAllAdministracionesView(generics.ListAPIView):
    queryset = AdministracionVacuna.objects.all()
    serializer_class = AdministracionVacunaSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)