from xlsxwriter.utility import xl_rowcol_to_cell
import io
import json
from functools import reduce
import xlsxwriter
from django.http import HttpResponse

from app.models import *

def cabezera_cuadro_consolidado(worksheet):
    worksheet.write(0, 1, "Fecha")
    worksheet.write(0, 2, "Cod.")
    worksheet.write(0, 3, "Direccion")
    worksheet.write(0, 4, "Tipo Mantenimiento")
    worksheet.write(0, 5, "Total Maq.")
    worksheet.write(0, 6, "Total Actv")
    worksheet.write(0, 7, "Total Map + Actv")
    worksheet.write(0, 8, "Material Util.")
    worksheet.write(0, 9, "Herramienta M.")
    worksheet.write(0, 10, "Tranporte")
    worksheet.write(0, 11, "Seg. Industrial")
    worksheet.write(0, 12, "RRHH Previo")
    worksheet.write(0, 13, "RRHH %")
    worksheet.write(0, 14, "RRHH Final")
    worksheet.write(0, 15, "Operacion")
    worksheet.write(0, 16, "Total")

def horario_precio(hora,costo):
    return (hora.hour * costo)+ ((hora.minute * costo)/60)

def precio_calculado(precios, fecha):
    for precio in precios:
        if precio.fecha_fin is None:
            return round(precio.costo, 2)
        elif precio.fecha_fin >= fecha:
            return round(precio.costo, 2)

def producto(valores):
    f = lambda a, b: a if (a == 0 or b == 0)  else a * b
    return round(reduce(f,valores,1),2)

def sumarAreas(_detalle):
    sum = 0
    detalles = DetalleOtActividadArea.objects.filter(detalle_ot_actividad=_detalle)
    for detalle in detalles:
        valores = (detalle.v1, detalle.v2, detalle.v3)
        sum += producto(valores)
    return sum


def excel_cuadro_consolidado(fecha):
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()
    ordenes = OrdenTrabajo.objects.filter(fecha_inicio__year=fecha.year, fecha_inicio__month=fecha.month, estado=1)

    date_format = workbook.add_format({'num_format': 'yyyy-mm-dd'})
    cabezera_cuadro_consolidado(worksheet)

    if ordenes.count() > 0:
        # Formula Sumatoria Final
        row_sum = ordenes.count() + 1
        for i in range(5, 17):
            worksheet.write_formula(row_sum, i, "=SUM(" + xl_rowcol_to_cell(1, i) + ":" + xl_rowcol_to_cell(row_sum - 1, i) + ")")
        row = 1
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
                costo = 0
                for sub_actividad in sub_actividades:
                    precios = TipoActividadPrecio.objects.filter(sub_actividad=sub_actividad["id"], fecha_inicio__lte=orden.fecha_inicio)
                    costo = precio_calculado(precios,orden.fecha_inicio)
                total_act += costo * sumarAreas(item)

            contratista = float(total_maq + total_act)
            if(contratista > 0):
                worksheet.write_datetime(row, 1, orden.fecha_inicio, date_format)
                worksheet.write(row, 2, orden.cod_crav)
                worksheet.write(row, 3, orden.direccion)
                worksheet.write(row, 4, orden.tipo_mantenimiento.descripcion)
                worksheet.write(row, 5, total_maq)
                worksheet.write(row, 6, total_act)
                worksheet.write(row, 7, contratista)

                fecha_rubro = orden.fecha_inicio.replace(day=1)
                precio_rubro = PrecioRubroFecha.objects.get(fecha_mes=fecha_rubro)
                _json = json.loads(precio_rubro.valores)
                # Transporte
                transporte = _json["transporte"]
                t_km = float(transporte["t_km"])
                v_km = float(transporte["v_km"])
                transporte_val = float(v_km * t_km)
                worksheet.write(row, 10, round(transporte_val, 2))
                # Seguridad Industrial
                seguridad = _json["seguridad"]
                t_si = float(seguridad["t_si"])
                c_hombre = float(seguridad["c_hombre"])
                seguridad_val = float((t_si * c_hombre) / ordenes.count())
                worksheet.write(row, 11, round(seguridad_val, 2))

                # Material Utilizado
                mat_ut = 0
                worksheet.write(row, 8, round(mat_ut, 2))

                # RRHH
                rrhh = _json["rrhh"]
                rrhh_promedio = float(rrhh["promedio"])
                rrhh_previo = contratista + mat_ut + transporte_val + seguridad_val
                worksheet.write(row, 12, round(rrhh_previo, 2))
                worksheet.write_formula(row, 13, "=" + xl_rowcol_to_cell(row, 12) + "/$F$" + str(ordenes.count() + 2))
                worksheet.write_formula(row, 14, "=" + xl_rowcol_to_cell(row, 13) + "*" + str(rrhh_promedio))

                # Operacion
                operacion = _json["operacion"]
                operacion_porce = float(operacion["porcentaje_op"])
                worksheet.write_formula(row, 15, "=(SUM(" + xl_rowcol_to_cell(row, 7) + ":" + xl_rowcol_to_cell(row,
                                                                                                                11) + ")+" + xl_rowcol_to_cell(
                    row, 14) + ")*" + str(operacion_porce))

                # Total
                worksheet.write_formula(row, 16, "=SUM(" + xl_rowcol_to_cell(row, 7) + ":" + xl_rowcol_to_cell(row,
                                                                                                               11) + ") + " + xl_rowcol_to_cell(
                    row, 15) + " + " + xl_rowcol_to_cell(row, 14))

                row += 1


    workbook.close()
    output.seek(0)

    response = HttpResponse(output.read(),
                            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename=cConsolidado.xlsx"
    return response