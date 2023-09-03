from rest_framework import serializers
from .models import Vacunatorio, Vacuna, AdministracionVacuna, TraspasoVacuna, EliminacionVacuna, VacunaStock

class VacunatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacunatorio
        fields = '__all__'

class VacunaStockSerializer(serializers.ModelSerializer):
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

class AdministracionVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdministracionVacuna
        fields = '__all__'

class TraspasoVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TraspasoVacuna
        fields = '__all__'

class EliminacionVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EliminacionVacuna
        fields = '__all__'

