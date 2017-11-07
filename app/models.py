# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class Area(models.Model):
    descripcion = models.TextField()

    class Meta:
        managed = False
        db_table = 'area'


class AreaRrhh(models.Model):
    rrhh = models.ForeignKey('Rrhh', models.DO_NOTHING, db_column='rrhh')
    cargo = models.ForeignKey('Cargo', models.DO_NOTHING, db_column='cargo')

    class Meta:
        managed = False
        db_table = 'area_rrhh'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Cargo(models.Model):
    descripcion = models.TextField()
    area = models.ForeignKey(Area, models.DO_NOTHING, db_column='area')

    class Meta:
        managed = False
        db_table = 'cargo'


class Contratista(models.Model):
    nombres = models.TextField()
    apellidos = models.TextField()
    cedula = models.TextField()
    ruc = models.TextField()

    class Meta:
        managed = False
        db_table = 'contratista'


class ContratistaMaquinaria(models.Model):
    stock = models.IntegerField(blank=True, null=True)
    contratista = models.ForeignKey(Contratista, models.DO_NOTHING, db_column='contratista')
    maquinaria = models.ForeignKey('Maquinaria', models.DO_NOTHING, db_column='maquinaria')

    class Meta:
        managed = False
        db_table = 'contratista_maquinaria'


class ContratistaMaquinariaPrecio(models.Model):
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    costo = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    contratista_maquinaria = models.ForeignKey(ContratistaMaquinaria, models.DO_NOTHING, db_column='contratista_maquinaria')

    class Meta:
        managed = False
        db_table = 'contratista_maquinaria_precio'


class DetalleFinicioFcierre(models.Model):
    fecha = models.DateField(blank=True, null=True)
    hora_entrada = models.TimeField(blank=True, null=True)
    hora_salida = models.TimeField(blank=True, null=True)
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo')

    class Meta:
        managed = False
        db_table = 'detalle_finicio_fcierre'


class DetalleOrdenTrabajo(models.Model):
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo')
    horas_totales = models.TimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalle_orden_trabajo'


class DetalleOtActividad(models.Model):
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo')
    tipo_actividad = models.ForeignKey('TipoActividad', models.DO_NOTHING, db_column='tipo_actividad', blank=True, null=True)
    sub_actividades = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalle_ot_actividad'


class DetalleOtActividadArea(models.Model):
    nombre = models.TextField()
    v1 = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    v2 = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    v3 = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    detalle_ot_actividad = models.ForeignKey(DetalleOtActividad, models.DO_NOTHING, db_column='detalle_ot_actividad')

    class Meta:
        managed = False
        db_table = 'detalle_ot_actividad_area'


class DetalleOtRubro(models.Model):
    v_total = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    tipo_rubro = models.ForeignKey('TipoRubro', models.DO_NOTHING, db_column='tipo_rubro')
    orden_trabajo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'detalle_ot_rubro'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Fotos(models.Model):
    nombre = models.CharField(max_length=45, blank=True, null=True)
    tipo = models.CharField(max_length=45, blank=True, null=True)
    datos = models.TextField(blank=True, null=True)
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fotos'


class Maquinaria(models.Model):
    descripcion = models.TextField()

    class Meta:
        managed = False
        db_table = 'maquinaria'


class Material(models.Model):
    nombre = models.TextField()
    stock = models.SmallIntegerField(blank=True, null=True)
    medida = models.TextField()

    class Meta:
        managed = False
        db_table = 'material'


class MaterialOt(models.Model):
    cantidadmaterial = models.IntegerField(blank=True, null=True)
    material = models.ForeignKey(Material, models.DO_NOTHING, db_column='material')
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo')

    class Meta:
        managed = False
        db_table = 'material_ot'


class MaterialPrecio(models.Model):
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    costo = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    material = models.ForeignKey(Material, models.DO_NOTHING, db_column='material')

    class Meta:
        managed = False
        db_table = 'material_precio'


class OrdenTrabajo(models.Model):
    direccion = models.TextField(blank=True, null=True)
    descripcion_problema = models.TextField(blank=True, null=True)
    observacion = models.TextField(blank=True, null=True)
    tipo_mantenimiento = models.ForeignKey('TipoMantenimiento', models.DO_NOTHING, db_column='tipo_mantenimiento')
    parroquia = models.ForeignKey('Parroquia', models.DO_NOTHING, db_column='parroquia')
    estado = models.CharField(max_length=1,default=1)
    cod_crav = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_cierre = models.DateField(blank=True, null=True)
    fecha_pedido = models.DateField(blank=True, null=True)
    fecha_planificada = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orden_trabajo'
        ordering = ["fecha_inicio"]


class OtContMaq(models.Model):
    cantidad = models.IntegerField(blank=True, null=True)
    contratista_maquinaria = models.ForeignKey(ContratistaMaquinaria, models.DO_NOTHING, db_column='contratista_maquinaria')
    orden_trabajo = models.ForeignKey(OrdenTrabajo, models.DO_NOTHING, db_column='orden_trabajo')

    class Meta:
        managed = False
        db_table = 'ot_cont_maq'


class OtRrhh(models.Model):
    area_rrhh = models.ForeignKey(AreaRrhh, models.DO_NOTHING, db_column='area_rrhh')
    orden_trabajo = models.ForeignKey(OrdenTrabajo, models.DO_NOTHING, db_column='orden_trabajo')

    class Meta:
        managed = False
        db_table = 'ot_rrhh'


class Parroquia(models.Model):
    descripcion = models.TextField(blank=True, null=True)
    abr = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'parroquia'


class PrecioRubroFecha(models.Model):
    valores = models.TextField()
    fecha_mes = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'precio_rubro_fecha'


class Rrhh(models.Model):
    cedula = models.TextField()
    nombres = models.TextField()
    apellidos = models.TextField()

    class Meta:
        managed = False
        db_table = 'rrhh'


class RubroOtDetalle(models.Model):
    cantidadmaterial = models.IntegerField(blank=True, null=True)
    material = models.IntegerField()
    detalle_ot_rubro = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'rubro_ot_detalle'


class SubActividad(models.Model):
    descripcion = models.TextField()
    tipo_actividad = models.ForeignKey('TipoActividad', models.DO_NOTHING, db_column='tipo_actividad')
    p_areas = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sub_actividad'


class TipoActividad(models.Model):
    descripcion = models.TextField()
    op_seleccion = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_actividad'


class TipoActividadPrecio(models.Model):
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    costo = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    sub_actividad = models.ForeignKey(SubActividad, models.DO_NOTHING, db_column='sub_actividad')

    class Meta:
        managed = False
        db_table = 'tipo_actividad_precio'


class TipoMantenimiento(models.Model):
    descripcion = models.TextField()
    abr = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_mantenimiento'


class TipoRubro(models.Model):
    descripcion = models.TextField()
    detalle = models.TextField()

    class Meta:
        managed = False
        db_table = 'tipo_rubro'


class TipoRubroPrecio(models.Model):
    costo = models.TextField()
    fecha_inicio = models.TextField()
    fecha_fin = models.TextField()
    tipo_rubro = models.ForeignKey(TipoRubro, models.DO_NOTHING, db_column='tipo_rubro')

    class Meta:
        managed = False
        db_table = 'tipo_rubro_precio'
