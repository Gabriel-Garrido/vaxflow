from rest_framework import serializers
from .models import Vacunatorio, Vacuna, AdministracionVacuna, TraspasoVacuna, EliminacionVacuna, VacunaStock

class VacunatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacunatorio
        fields = '__all__'

class VacunaStockSerializer(serializers.ModelSerializer):
    hora_descongelacion = serializers.TimeField(format='%H:%M'),
    nombre_vacuna = serializers.CharField(source='tipo_vacuna.nombre', read_only=True)
    nombre_vacunatorio = serializers.CharField(source='vacunatorio.nombre', read_only=True)
    caducidad_fabricante = serializers.CharField(source='tipo_vacuna.fecha_caducidad_fabricante', read_only=True)
    lote = serializers.CharField(source='tipo_vacuna.lote', read_only=True)

    class Meta:
        model = VacunaStock
        fields = '__all__'

class VacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacuna
        fields = '__all__'

class TraspasoVacunaSerializer(serializers.ModelSerializer):
    vacuna_traspaso_nombre = serializers.CharField(source='vacuna_traspaso.tipo_vacuna.nombre', read_only=True)
    vacuna_traspaso_lote = serializers.CharField(source='vacuna_traspaso.tipo_vacuna.lote', read_only=True)
    vacuna_traspaso_caducidad = serializers.DateField(source='vacuna_traspaso.tipo_vacuna.fecha_caducidad_fabricante', read_only=True)
    vacunatorio_origen_nombre = serializers.CharField(source='vacuna_traspaso.vacunatorio.nombre', read_only=True)
    vacunatorio_destino_nombre = serializers.CharField(source='vacunatorio_destino.nombre', read_only=True)
    responsable_entrega_nombre = serializers.CharField(source='responsable_entrega.name', read_only=True)
    responsable_recepcion_nombre = serializers.CharField(source='responsable_recepcion.name', read_only=True)
    

    class Meta:
        model = TraspasoVacuna
        fields = '__all__'

class EliminacionVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EliminacionVacuna
        fields = '__all__'

class AdministracionVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdministracionVacuna
        fields = '__all__'
