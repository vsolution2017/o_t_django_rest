from django.http import JsonResponse, HttpResponse, Http404
from django.shortcuts import render
#from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .tests import *
from .serializers import *

def list_ot(request):
    return render(request, 'app/list_ot.html', {"title": "Listado de Ordenes de Trabajo"})
def test(request):
    return render(request, 'app/test.html', {"title": "Configuración"})
def settings(request):
    return render(request, 'app/settings_ot.html', { "title" : "Precio Rubro Mensual"})
def login(request):
    return render(request,'app/login.html',{})
def admin(request):
    return render(request,'app/base.html',{})
def o_t(request):
    return render(request, 'app/register_ot.html', { "title" : "Orden de Trabajo"})



class ListView(APIView):
    def get(self,request,op):
        if op == "parroquia":
            parroquias = Parroquia.objects.all()
            parroquias_json = ParroquiaSerializer(parroquias, many=True)
            return Response(parroquias_json.data)
        elif op == "mantenimiento":
            tipo_mantenimientos = TipoMantenimiento.objects.all()
            tipo_mantenimientos_json = TipoMantenimientoSerializer(tipo_mantenimientos, many=True)
            return Response(tipo_mantenimientos_json.data)
        elif op == "actividad":
            actividades = TipoActividad.objects.all()
            actividades_json = TipoActividadSerializer(actividades,many=True)
            return Response(actividades_json.data)


class PrecioRubroView(APIView):
    def get(self,request):
        precio_rubro = PrecioRubroFecha.objects.all()
        precio_rubro_json = PrecioRubroFechaSerializer(precio_rubro,many=True)
        return Response(precio_rubro_json.data)
        pass
    def post(self,request):
        precio_rubro = PrecioRubroFechaSerializer(data=request.data)
        if precio_rubro.is_valid():
            precio_rubro.save()
            return Response(precio_rubro.data, status=201)
        return Response(precio_rubro.errors, status=400)

class Detail_PrecioRubroView(APIView):
    def get_object(self,pk):
        try:
            return PrecioRubroFecha.objects.get(pk=pk)
        except PrecioRubroFecha.DoesNotExist:
            raise Http404

    def put(self,request,pk):
        precio_rubro = self.get_object(pk)
        precio_rubro_json = PrecioRubroFechaSerializer(precio_rubro,data=request.data)
        if precio_rubro_json.is_valid():
            precio_rubro_json.save()
            return Response(precio_rubro_json.data)
        return Response(precio_rubro.errors, status=400)
    def delete(self,request,pk):
        precio_rubro = self.get_object(pk)
        precio_rubro.delete()
        return Response(status=204)


class Contratista_view(APIView):
    def get(self,request):
        contratistas = Contratista.objects.all()
        contratistas_json = ContratistaSerializer(contratistas, many=True)
        return Response(contratistas_json.data)

class Maquinaria_view(APIView):
    def get(self,request,pk_contratista):
        contratista = Contratista.objects.get(pk=pk_contratista)
        maq_conts = ContratistaMaquinaria.objects.filter(contratista=contratista).select_related()
        maq_conts_json = ContratistaMaquinariaSerializer(maq_conts,many=True)
        return Response(maq_conts_json.data)

class SubActividad_view(APIView):
    def get(self, request, pk_actividad):
        tipo_actividad = TipoActividad.objects.get(pk=pk_actividad)
        sub_actividades = SubActividad.objects.filter(tipo_actividad=tipo_actividad)
        sub_actividades_json = SubActividadSerializer(sub_actividades,many=True)
        return Response(sub_actividades_json.data)

class Cargo_view(APIView):
    def get(self,request,pk_cargo):
        cargos = AreaRrhh.objects.filter(cargo=pk_cargo)
        cargos_json = AreaRrhhSerializer(cargos,many=True)
        return Response(cargos_json.data)

class Orden_TrabajoView(APIView):
    """
    def get_array(self,id_orden,_array):
        _array = json.loads(_array)
        for item in _array:
            item["orden_trabajo"] = id_orden
        return _array
    """

    def get(self,request):
        ordenes = OrdenTrabajo.objects.filter(estado=1)
        ordenes_json = OrdenTrabajoSerializer_tabview(ordenes,many=True)
        return Response(ordenes_json.data)

    def post(self, request):
        orden = OrdenTrabajoSerializer(data=request.data)
        if orden.is_valid():
            orden.save()
            # Guardar Horas
            horas = get_array(orden.data["id"],"orden_trabajo", request.data["horas"])
            horas_json = DetalleFinicioFcierreSerializer(data=horas, many=True)

            if horas_json.is_valid():
                horas_json.save()
            else:
                return Response(horas_json.errors, status=400)

            # Guardar Maquinarias
            maquinarias = get_array(orden.data["id"],"orden_trabajo", request.data["maquinarias"])
            maquinarias_json = OtContMaqSerializer(data=maquinarias,many=True)

            if maquinarias_json.is_valid():
                maquinarias_json.save()
                #return Response(maquinarias_json.data, status=201)
            else:
                return Response(maquinarias_json.errors, status=400)

            # Guardar Actividades
            actividades = get_array(orden.data["id"],"orden_trabajo",request.data["actividades"])
            actividades_json = DetalleOtActividadSerializer(data=actividades,many=True)

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

            return Response({ "estado" : "ok"}, status=201)
        return Response(orden.errors, status=400)

class Detail_Orden_TrabajoView(APIView):
    def get_object(self,pk):
        try:
            return OrdenTrabajo.objects.get(pk=pk)
        except OrdenTrabajo.DoesNotExist:
            raise Http404
    def put(self,request):
        pass
    def delete(self,request,pk):
        orden = self.get_object(pk)
        orden.estado = 0
        orden.save()
        return Response(OrdenTrabajoSerializer(orden).data,status=201)


class ExampleView(APIView):

    parser_classes = (JSONParser,)
    renderer_classes = (JSONRenderer,)

    def post(self, request, format=None):
        actividades = request.data["actividades"]
        for act in actividades:
            _array = get_array("0", "detalle_ot_actividad", act["areas"])
            return Response(_array, status=201)




