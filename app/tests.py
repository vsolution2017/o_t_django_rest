import json
import datetime
from app.models import *
from app.serializers import *
from rest_framework.response import Response

from app.serializers import PrecioRubroFechaSerializer


def get_array(value,key,_array):
    _array = json.loads(_array)
    for item in _array:
        item[key] = value
    return _array

def parse_str_fecha(fecha):
    return datetime.datetime.strptime(fecha, '%Y%m%d').date()

def save_ordenTrabajo(datos, orden):
    # Guardar Horas
    horas = get_array(orden.data["id"], "orden_trabajo", datos["horas"])
    horas_json = DetalleFinicioFcierreSerializer(data=horas, many=True)

    if horas_json.is_valid():
        horas_json.save()
    else:
        return Response(horas_json.errors, status=400)

    # Guardar Detalles
    detalle = get_array(orden.data["id"], "orden_trabajo", datos["detalle"])
    detalle_json = DetalleOrdenTrabajoSerializer(data=detalle, many=True)
    if detalle_json.is_valid():
        detalle_json.save()
    else:
        return Response(detalle_json.errors, status=400)

    # Guardar Maquinarias
    maquinarias = get_array(orden.data["id"], "orden_trabajo", datos["maquinarias"])
    maquinarias_json = OtContMaqSerializer(data=maquinarias, many=True)

    if maquinarias_json.is_valid():
        maquinarias_json.save()
    else:
        return Response(maquinarias_json.errors, status=400)

    # Guardar Actividades
    actividades = get_array(orden.data["id"], "orden_trabajo", datos["actividades"])
    actividades_json = DetalleOtActividadSerializer(data=actividades, many=True)

    if actividades_json.is_valid():
        actividades_json.save()
        #Se recorren las actividades para asignar el [id] correspondiente
        i = 0
        for actividad in actividades_json.data:
            areas = get_array(actividad["id"], "detalle_ot_actividad",
                              actividades[i]["areas"])
            i+=1
            areas_json = DetalleOtActividadAreaSerializer(data=areas, many=True)
            if areas_json.is_valid():
                areas_json.save()
            else:
                return Response(areas_json.errors, status=400)
    else:
        return Response(actividades_json.errors, status=400)

    # Guardar Fotos
    fotos = get_array(orden.data["id"], "orden_trabajo", datos["fotos"])
    fotos_json = FotosSerializer(data=fotos, many=True)

    if fotos_json.is_valid():
        fotos_json.save()
    else:
        Response(fotos_json.errors, status=400)

    # Guardar Material
    material = get_array(orden.data["id"], "orden_trabajo", datos["material"])
    material_json = MaterialOtSerializer(data=material, many=True)

    if material_json.is_valid():
        material_json.save()
    else:
        Response(material_json.errors, status=400)