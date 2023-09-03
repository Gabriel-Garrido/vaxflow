from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    vacunatorio_nombre = serializers.CharField(source='vacunatorio.nombre', read_only=True)
    class Meta:
        model = CustomUser
        fields = ('username', 'rut', 'name', 'last_name', 'phone', 'email', 'vacunatorio', 'vacunatorio_nombre')
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Aquí puedes personalizar el serializador según tus necesidades
    # Por ejemplo, agregar campos adicionales al token o cambiar el comportamiento
    pass