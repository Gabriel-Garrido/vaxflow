from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from authentication.serializers import CustomUserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from .models import Vacunatorio, Vacuna, AdministracionVacuna, TraspasoVacuna, EliminacionVacuna, VacunaStock, RetiroCamara, RegistroInventario
from .serializer import VacunatorioSerializer, VacunaSerializer, AdministracionVacunaSerializer, TraspasoVacunaSerializer, EliminacionVacunaSerializer, VacunaStockSerializer, RetiroCamaraSerializer, RegistroInventarioSerializer
from datetime import datetime
from django.utils import timezone

class VacunatorioViewSet(viewsets.ModelViewSet):
    queryset = Vacunatorio.objects.all()
    serializer_class = VacunatorioSerializer

class VacunaStockViewSet(viewsets.ModelViewSet):
    queryset = VacunaStock.objects.all()
    serializer_class = VacunaStockSerializer

    def create(self, request, *args, **kwargs):
        # Obtén los datos de la solicitud POST
        data = request.data
        tipo_vacuna_id = data.get('tipo_vacuna')
        fecha_descongelacion = data.get('fecha_descongelacion')
        fecha_caducidad_descongelacion = data.get('fecha_caducidad_descongelacion')
        hora_descongelacion = data.get('hora_descongelacion')
        vacunatorio_id = data.get('vacunatorio')
        stock_to_add = int(data.get('stock', 0))  # Convierte el stock a entero

        # Convierte campos de fecha y hora vacíos en None
        if fecha_descongelacion == '':
            fecha_descongelacion = None
        if fecha_caducidad_descongelacion == '':
            fecha_caducidad_descongelacion = None
        if hora_descongelacion == '':
            hora_descongelacion = None

        # Busca un registro existente con los mismos valores
        existing_record = VacunaStock.objects.filter(
            tipo_vacuna=tipo_vacuna_id,
            fecha_descongelacion=fecha_descongelacion,
            fecha_caducidad_descongelacion=fecha_caducidad_descongelacion,
            hora_descongelacion=hora_descongelacion,
            vacunatorio=vacunatorio_id
        ).first()

        if existing_record:
            # Si existe un registro, actualiza el stock
            existing_record.stock += stock_to_add  # Suma el stock de la solicitud
            existing_record.save()
            serializer = self.get_serializer(existing_record)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Si no existe un registro, crea uno nuevo
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class RegistroInventarioViewSet(viewsets.ModelViewSet):
    queryset = RegistroInventario.objects.all()
    serializer_class = RegistroInventarioSerializer

    def create(self, request, *args, **kwargs):
        # Verificar si ya existe un registro con la misma fecha y VacunaStock
        fecha = request.data.get('fecha')
        vacuna_stock_id = request.data.get('vacuna_stock')

        if fecha is not None:
            # Formatear la fecha para que no considere la hora
            formatted_fecha = datetime.strptime(fecha, '%Y-%m-%d').date()
        else:
            # Si la fecha es None, usa la fecha de hoy
            formatted_fecha = timezone.now().date()

        try:
            registro_existente = RegistroInventario.objects.get(fecha=formatted_fecha, vacuna_stock=vacuna_stock_id)
            serializer = RegistroInventarioSerializer(registro_existente, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RegistroInventario.DoesNotExist:
            serializer = RegistroInventarioSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetiroCamaraViewSet(viewsets.ModelViewSet):
    queryset = RetiroCamara.objects.all()
    serializer_class = RetiroCamaraSerializer

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