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

class TipoActividadPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoActividadPrecio
        fields = ('id', 'fecha_inicio','fecha_fin','costo')

class SubActividadSerializer(serializers.ModelSerializer):
    precio = serializers.SerializerMethodField()
    class Meta:
        model = SubActividad
        fields = ('id', 'descripcion','precio')
    def get_precio(self,obj):
        try:
            tipo_precio = TipoActividadPrecio.objects.filter(sub_actividad=obj.id).latest('fecha_inicio')
            tipo_precio_json = TipoActividadPrecioSerializer(tipo_precio)
            return tipo_precio_json.data
        except TipoActividadPrecio.DoesNotExist:
            return 0
class RrhhSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rrhh
        fields = ('id', 'nombres', 'apellidos')


class AreaRrhhSerializer(serializers.ModelSerializer):
    h = serializers.SerializerMethodField()
    class Meta:
        model = AreaRrhh
        fields = ('id', 'cargo', 'rrhh', 'h')
    def get_h(self,obj):
        rrhh = Rrhh.objects.get(pk=obj.rrhh.id)
        rrhh_json = RrhhSerializer(rrhh)
        return rrhh_json.data

class PrecioRubroFechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecioRubroFecha
        fields = ('id', 'valores', 'fecha_mes')


class OrdenTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrabajo
        fields = ('id','fecha_pedido','fecha_planificada','direccion','descripcion_problema','observacion','tipo_mantenimiento','parroquia')