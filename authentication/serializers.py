from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Aquí puedes personalizar el serializador según tus necesidades
    # Por ejemplo, agregar campos adicionales al token o cambiar el comportamiento
    pass