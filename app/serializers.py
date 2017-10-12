from rest_framework import serializers
from .models import *


class ContratistaSerializer(serializers.ModelSerializer):
    class Meta:
        model= Contratista
        fields= ('id','nombres', 'apellidos')

class MaquinariaSerializer(serializers.ModelSerializer):
    class Meta:
        model= Maquinaria
        fields= ('id','descripcion')

class ContratistaMaquinariaSerializer(serializers.ModelSerializer):
    maquinaria = MaquinariaSerializer(read_only=True)
    class Meta:
        model= ContratistaMaquinaria
        fields= ('id','maquinaria','contratista')

class TipoMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMantenimiento
        fields = ('id', 'descripcion')

class ParroquiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parroquia
        fields = ('id', 'descripcion')

class TipoActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoActividad
        fields = ('id', 'descripcion', 'op_seleccion')