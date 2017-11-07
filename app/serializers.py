from rest_framework import serializers
from .models import *
import json


class ContratistaSerializer(serializers.ModelSerializer):
    class Meta:
        model= Contratista
        fields= ('id','nombres', 'apellidos')

class MaquinariaSerializer(serializers.ModelSerializer):
    class Meta:
        model= Maquinaria
        fields= ('id','descripcion')

class ContratistaMaquinariaPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContratistaMaquinariaPrecio
        fields = ('id','fecha_inicio','fecha_fin','costo')

class ContratistaMaquinariaSerializer(serializers.ModelSerializer):
    maquinaria = MaquinariaSerializer(read_only=True)
    #precio = serializers.SerializerMethodField()
    class Meta:
        model = ContratistaMaquinaria
        fields = ('id','maquinaria','contratista','stock')
    """
    def get_precio(self, obj):
        try:
            tipo_precio = ContratistaMaquinariaPrecio.objects.filter(contratista_maquinaria=obj.id).latest('fecha_inicio')
            tipo_precio_json = ContratistaMaquinariaPrecioSerializer(tipo_precio)
            return tipo_precio_json.data
        except ContratistaMaquinariaPrecio.DoesNotExist:
            return 0
    """

class TipoMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMantenimiento
        fields = "__all__"

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
    #precio = serializers.SerializerMethodField()
    class Meta:
        model = SubActividad
        fields = ('id', 'descripcion')
    """
    def get_precio(self,obj):
        try:
            tipo_precio = TipoActividadPrecio.objects.filter(sub_actividad=obj.id).latest('fecha_inicio')
            tipo_precio_json = TipoActividadPrecioSerializer(tipo_precio)
            return tipo_precio_json.data
        except TipoActividadPrecio.DoesNotExist:
            return 0
    """

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

class DetalleFinicioFcierreSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleFinicioFcierre
        fields = "__all__"

class OtContMaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtContMaq
        fields = "__all__"

class OtContMaqSerializer_get(serializers.ModelSerializer):
    contratista_maquinaria = ContratistaMaquinariaSerializer(read_only=True)
    class Meta:
        model = OtContMaq
        fields = ("id","cantidad","contratista_maquinaria")

class DetalleOrdenTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleOrdenTrabajo
        fields = "__all__"

class DetalleOtActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleOtActividad
        fields = "__all__"


class DetalleOtActividadSerializer_get(serializers.ModelSerializer):
    #sub_actividades = serializers.SerializerMethodField()
    #tipo_actividad = serializers.SerializerMethodField()
    areas = serializers.SerializerMethodField()
    class Meta:
        model = DetalleOtActividad
        fields = ("id","sub_actividades","tipo_actividad","areas")
    """
    def get_sub_actividades(self,obj):
        subs = []
        for sub in json.loads(obj.sub_actividades):
            subs.append(SubActividad.objects.get(pk=sub["id"]))
        return SubActividadSerializer(subs,many=True).data


    def get_tipo_actividad(self,obj):
        tipo_actividad = TipoActividad.objects.get(pk=obj.tipo_actividad.id)
        return TipoActividadSerializer(tipo_actividad).data
    """
    def get_areas(self,obj):
        detalles = DetalleOtActividadArea.objects.filter(detalle_ot_actividad=obj)
        return DetalleOtActividadAreaSerializer(detalles,many=True).data

class DetalleOtActividadAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleOtActividadArea
        fields = "__all__"


class OrdenTrabajoSerializer_tabview(serializers.ModelSerializer):
    t_mantenimiento = serializers.SerializerMethodField()
    horas = serializers.SerializerMethodField()
    class Meta:
        model = OrdenTrabajo
        fields = ('id','t_mantenimiento','horas','fecha_inicio','fecha_cierre','cod_crav')
        #fields = "__all__"
        #extra_fields = ['t_mantenimiento','horas','f_inicio','f_cierre','codigo']

    def get_t_mantenimiento(self, obj):
        return obj.tipo_mantenimiento.descripcion

    def get_horas(self,obj):
        try:
            horas = DetalleFinicioFcierre.objects.filter(orden_trabajo=obj.id)
            return DetalleFinicioFcierreSerializer(horas, many=True).data
        except DetalleFinicioFcierre.DoesNotExist:
            return 0

    """
    def get_f_inicio(self,obj):
        return obj.fecha_inicio

    def get_codigo(self,obj):
        return obj.cod_crav

    def get_f_cierre(self, obj):
        return obj.fecha_cierre
    """

# Vista para la clase normal
class OrdenTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrabajo
        fields = "__all__"


#Vista para Cuadro Consolidado Ordenes de Trabajo
class OrdenTrabajo_CCSerializer(serializers.ModelSerializer):
    t_mantenimiento = serializers.SerializerMethodField()
    class Meta:
        model = OrdenTrabajo
        fields = ["id","cod_crav","direccion","t_mantenimiento"]
    def get_t_mantenimiento(self,obj):
        return obj.tipo_mantenimiento.descripcion # TipoMantenimiento.objects.get(pk=obj.tipo_mantenimiento.id).descripcion

class FotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fotos
        fields = "__all__"


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = "__all__"