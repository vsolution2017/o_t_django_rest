import json
import datetime
import time

import io
import xlsxwriter
from django.http import HttpResponse

from app.models import *


def get_array(value,key,_array):
    _array = json.loads(_array)
    for item in _array:
        item[key] = value
    return _array

def parse_str_fecha(fecha):
    return datetime.datetime.strptime(fecha, '%Y%m%d').date()

def horario_precio(hora,costo):
    return (hora.hour * costo)+ ((hora.minute * costo)/60)

def precio_calculado(precios, fecha):
    count = precios.count()
    cont = 1
    for precio in precios:
        if precio.fecha_fin is None:
            if count == cont:
                return precio.costo
        elif precio.fecha_fin >= fecha:
            return precio.costo
        cont += 1

def excel_cuadro_consolidado():
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()
    ordenes = OrdenTrabajo.objects.all()

    date_format = workbook.add_format({'num_format': 'yyyy-mm-dd'})

    row = 1
    col = 0
    for orden in ordenes:
        # Maquinarias
        ot_cont_maq = OtContMaq.objects.filter(orden_trabajo=orden)
        total_maq = 0
        for item in ot_cont_maq:
            #fecha = parse_str_fecha("20171015")
            precios = ContratistaMaquinariaPrecio.objects.filter(contratista_maquinaria=item.contratista_maquinaria, fecha_inicio__lte= orden.fecha_inicio)
            costo = precio_calculado(precios,orden.fecha_inicio)
            total_maq += (item.cantidad * horario_precio(DetalleOrdenTrabajo.objects.get(orden_trabajo=orden).horas_totales, costo))

        # Actividades
        detalle_actividades = DetalleOtActividad.objects.filter(orden_trabajo=orden)
        total_act = 0
        for item in detalle_actividades:
            sub_actividades = json.loads(item.sub_actividades)
            for sub_actividad in sub_actividades:
                precios = TipoActividadPrecio.objects.filter(sub_actividad=sub_actividad["id"], fecha_inicio__lte=orden.fecha_inicio)
                costo = precio_calculado(precios,orden.fecha_inicio)



        worksheet.write_datetime(row, 1, orden.fecha_inicio, date_format)
        worksheet.write(row, 2, orden.cod_crav)
        worksheet.write(row, 3, orden.direccion)
        worksheet.write(row, 4, orden.tipo_mantenimiento.descripcion)
        worksheet.write(row, 5, total_maq)
        worksheet.write(row, 6, total_act)
        row += 1
    workbook.close()
    output.seek(0)

    response = HttpResponse(output.read(),
                            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename=test.xlsx"
    return response

