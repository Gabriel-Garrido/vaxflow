from rest_framework import serializers
from .models import Vacuna, Vacunatorio, InventarioVacuna, RetiroCamara, TraspasoVacuna, EliminacionVacuna, AdministracionVacuna

class VacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacuna
        fields = '__all__'

class VacunatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacunatorio
        fields = '__all__'

class InventarioVacunaSerializer(serializers.ModelSerializer):
    vacuna_nombre = serializers.CharField(source='vacuna.nombre', read_only=True)    
    
    class Meta:
        model = InventarioVacuna
        fields = '__all__'

class RetiroCamaraSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetiroCamara
        fields = '__all__'

class TraspasoVacunaSerializer(serializers.ModelSerializer):
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
