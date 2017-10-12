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


class Cargo(models.Model):
    descripcion = models.TextField()
    area = models.ForeignKey(Area, models.DO_NOTHING, db_column='area')

    class Meta:
        managed = False
        db_table = 'cargo'


class Contratista(models.Model):
    nombres = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=50)
    cedula = models.TextField(max_length=50)
    ruc = models.TextField(max_length=50)

    class Meta:
        managed = False
        db_table = 'contratista'
    def __str__(self):
        return  self.nombres


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

    class Meta:
        managed = False
        db_table = 'detalle_orden_trabajo'


class DetalleOtActividad(models.Model):
    costo = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo')

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
    orden_trabajo = models.ForeignKey('OrdenTrabajo', models.DO_NOTHING, db_column='orden_trabajo')

    class Meta:
        managed = False
        db_table = 'detalle_ot_rubro'


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class Maquinaria(models.Model):
    descripcion = models.TextField()

    class Meta:
        managed = False
        db_table = 'maquinaria'


class Material(models.Model):
    nombre = models.TextField()

    class Meta:
        managed = False
        db_table = 'material'


class OrdenTrabajo(models.Model):
    fecha_pedido = models.TextField()
    fecha_planificada = models.TextField()
    direccion = models.TextField()
    descripcion_problema = models.TextField()
    observacion = models.TextField()
    tipo_mantenimiento = models.ForeignKey('TipoMantenimiento', models.DO_NOTHING, db_column='tipo_mantenimiento')
    parroquia = models.ForeignKey('Parroquia', models.DO_NOTHING, db_column='parroquia', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orden_trabajo'


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

    class Meta:
        managed = False
        db_table = 'parroquia'


class Rrhh(models.Model):
    cedula = models.TextField()
    nombres = models.TextField()
    apellidos = models.TextField()

    class Meta:
        managed = False
        db_table = 'rrhh'


class RubroOtDetalle(models.Model):
    cantidadmaterial = models.IntegerField(blank=True, null=True)
    material = models.ForeignKey(Material, models.DO_NOTHING, db_column='material')
    detalle_ot_rubro = models.ForeignKey(DetalleOtRubro, models.DO_NOTHING, db_column='detalle_ot_rubro')

    class Meta:
        managed = False
        db_table = 'rubro_ot_detalle'


class SubActividad(models.Model):
    descripcion = models.TextField()
    tipo_actividad = models.ForeignKey('TipoActividad', models.DO_NOTHING, db_column='tipo_actividad')

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
    fecha_inicio = models.DateTimeField(blank=True, null=True)
    fecha_fin = models.DateTimeField(blank=True, null=True)
    costo = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    sub_actividad = models.ForeignKey(SubActividad, models.DO_NOTHING, db_column='sub_actividad')

    class Meta:
        managed = False
        db_table = 'tipo_actividad_precio'


class TipoMantenimiento(models.Model):
    descripcion = models.TextField()

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
