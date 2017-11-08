import datetime

from django.db.models import Count
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
from .excel_generador import excel_cuadro_consolidado,precio_calculado
from .serializers import *

def list_ot(request):
    return render(request, 'app/list_ot.html', {"title": "Listado de Ordenes de Trabajo"})

def c_consolidado(request):
    pass


def test(request):
    return render(request, 'app/test.html', {"title": "Configuración"})
def settings(request):
    return render(request, 'app/settings_ot.html', { "title" : "Precio Rubro Mensual"})
def login(request):
    return render(request,'app/login.html',{})
def admin(request):
    return render(request,'app/base.html',{})
def o_t_register(request):
    return render(request, 'app/register_ot.html', { "title" : "Orden de Trabajo", "id" : 0})
def o_t_update(request,pk):
    return render(request, 'app/register_ot.html', { "title" : "Orden de Trabajo", "id" : pk})

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
            actividades_json = TipoActividadSerializer(actividades, many=True)
            return Response(actividades_json.data)
    def post(self,request,op):
        init = int(request.data["inicio"])
        fin = int(request.data["fin"])
        if op == "ot":
            fechaI = parse_str_fecha(request.data["finicio"])
            fechaF = parse_str_fecha(request.data["ffin"])
            count = OrdenTrabajo.objects.filter(fecha_inicio__range=(fechaI, fechaF), estado=1).count()
            ordenes = OrdenTrabajo.objects.filter(fecha_inicio__range=(fechaI, fechaF), estado=1)[
                init:fin]
            ordenes_json = OrdenTrabajoSerializer_tabview(ordenes, many=True)
            return Response({
                "count": count,
                "datos": ordenes_json.data
            }, status=201)
        elif op == "precio_rubro":
            count = PrecioRubroFecha.objects.filter(fecha_mes__year=request.data["año"]).count()
            precio_rubro = PrecioRubroFecha.objects.filter(fecha_mes__year=request.data["año"])[
                init:fin]
            precio_rubro_json = PrecioRubroFechaSerializer(precio_rubro, many=True)
            return Response({
                "count": count,
                "datos": precio_rubro_json.data
            }, status=201)
        elif op == "material":
            count = Material.objects.filter().count()
            material = Material.objects.filter()[init:fin]
            material_json = MaterialSerializer(material,many=True)
            return Response({
                "count": count,
                "datos": material_json.data
            }, status=201)

class PrecioRubroView(APIView):
    def get(self,request):
        precio_rubro = PrecioRubroFecha.objects.all()
        precio_rubro_json = PrecioRubroFechaSerializer(precio_rubro, many=True)
        return Response(precio_rubro_json.data)

    def post(self,request):
        if PrecioRubroFecha.objects.filter(fecha_mes=request.data["fecha_mes"]).exists():
            return  Response({"estado": "Configuración Existente"},status=201)
        else:
            precio_rubro = PrecioRubroFechaSerializer(data=request.data)
            if precio_rubro.is_valid():
                precio_rubro.save()
                return Response(precio_rubro.data, status=201)
            return Response(precio_rubro.errors, status=400)

class Detail_PrecioRubroView(APIView):
    def get_object(self,pk,op):
        try:
            if op == "id":
                return PrecioRubroFecha.objects.get(pk=pk)
            else:
                date = parse_str_fecha(pk) #datetime.datetime.strptime(pk, '%Y%m%d').date()
                return PrecioRubroFecha.objects.get(fecha_mes=date)
        except PrecioRubroFecha.DoesNotExist:
            raise Http404
    def get(self,request,pk,op):
        try:
            precio_rubro_fecha = self.get_object(pk, op)
            precio_rubro_fecha_json = PrecioRubroFechaSerializer(precio_rubro_fecha)

            if op == "date":
                fecha_mes = parse_str_fecha(pk)
                cantidad_ot = OrdenTrabajo.objects.filter(fecha_inicio__year=fecha_mes.year, fecha_inicio__month=fecha_mes.month, estado=1).count()
                return Response({
                                    "precio_rubro" : precio_rubro_fecha_json.data,
                                    "cantidad_ot": cantidad_ot
                                }, status=201)

            return Response(precio_rubro_fecha_json.data)
        except PrecioRubroFecha.DoesNotExist:
            raise Http404

    def put(self,request,pk,op):
        precio_rubro = self.get_object(pk,op)
        precio_rubro_json = PrecioRubroFechaSerializer(precio_rubro,data=request.data)
        if precio_rubro_json.is_valid():
            precio_rubro_json.save()
            return Response(precio_rubro_json.data)
        return Response(precio_rubro.errors, status=400)

    def delete(self,request,pk,op):
        precio_rubro = self.get_object(pk,op)
        precio_rubro.delete()
        return Response(status=204)


class Contratista_view(APIView):
    def get(self,request):
        contratistas = Contratista.objects.all()
        contratistas_json = ContratistaSerializer(contratistas, many=True)
        return Response(contratistas_json.data)

class Maquinaria_view(APIView):
    def get(self,request,pk_contratista, fecha):
        #contratista = Contratista.objects.get(pk=pk_contratista)
        maq_conts = ContratistaMaquinaria.objects.filter(contratista=pk_contratista).select_related()
        maq_conts_json = ContratistaMaquinariaSerializer(maq_conts, many=True)
        _fecha = parse_str_fecha(fecha)
        for maq_con in maq_conts_json.data:
            maq_con["precio"] = precio_calculado(ContratistaMaquinariaPrecio.objects.filter(contratista_maquinaria=maq_con["id"],fecha_inicio__lte=_fecha),_fecha)
        return Response(maq_conts_json.data)

class SubActividad_view(APIView):
    def get(self, request, pk_actividad, fecha):
        #tipo_actividad = TipoActividad.objects.get(pk=pk_actividad)
        sub_actividades = SubActividad.objects.filter(tipo_actividad=pk_actividad)
        sub_actividades_json = SubActividadSerializer(sub_actividades, many=True)
        for sub in sub_actividades_json.data:
            _fecha = parse_str_fecha(fecha)
            sub["precio"] = precio_calculado(TipoActividadPrecio.objects.filter(sub_actividad=sub["id"],fecha_inicio__lte=_fecha),_fecha)
        return Response(sub_actividades_json.data)

class Cargo_view(APIView):
    def get(self,request,pk_cargo):
        cargos = AreaRrhh.objects.filter(cargo=pk_cargo)
        cargos_json = AreaRrhhSerializer(cargos,many=True)
        return Response(cargos_json.data)

class Orden_TrabajoView(APIView):
    def get(self,request):
        ordenes = OrdenTrabajo.objects.filter(estado=1)
        ordenes_json = OrdenTrabajoSerializer_tabview(ordenes,many=True)
        return Response(ordenes_json.data)

    def post(self, request):
        orden = OrdenTrabajoSerializer(data=request.data)
        if orden.is_valid():
            orden.save()
            save_ordenTrabajo(request.data, orden)

        return Response(orden.errors, status=400)

class Detail_Orden_TrabajoView(APIView):
    def get_object(self, pk):
        try:
            return OrdenTrabajo.objects.get(pk=pk)
        except OrdenTrabajo.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        orden = self.get_object(pk)
        otContMaq = OtContMaq.objects.filter(orden_trabajo=orden)
        detalleOtActividad = DetalleOtActividad.objects.filter(orden_trabajo=orden)
        horas = DetalleFinicioFcierre.objects.filter(orden_trabajo=orden)
        fotos = Fotos.objects.filter(orden_trabajo=orden)
        material = MaterialOt.objects.filter(orden_trabajo=orden)
        #fotos_json = FotosSerializer(fotos, many=True)
        return Response({
            "orden": OrdenTrabajoSerializer(orden).data,
            "maquinaria": OtContMaqSerializer_get(otContMaq,many=True).data,
            "actividades": DetalleOtActividadSerializer_get(detalleOtActividad, many=True).data,
            "horas" : DetalleFinicioFcierreSerializer(horas,many=True).data,
            "fotos": FotosSerializer(fotos, many=True).data,
            "material": MaterialOtSerializer_table(material, many=True).data
        }, status=201)

    def put(self, request, pk, format=None):
        orden = self.get_object(pk)
        orden_json = OrdenTrabajoSerializer(orden, data=request.data)
        if orden_json.is_valid():
            orden_json.save()
            # Eliminacion de Actividades
            DetalleOtActividad.objects.filter(orden_trabajo=orden).delete()
            # Eliminacion de Maquinarias
            OtContMaq.objects.filter(orden_trabajo=orden).delete()
            # Eliminacion Horas
            DetalleFinicioFcierre.objects.filter(orden_trabajo=orden).delete()
            # Eliminar Material
            MaterialOt.objects.filter(orden_trabajo=orden).delete()

            # Actualizar
            save_ordenTrabajo(request.data, orden_json)
            return Response(orden_json.data, status=201)

        return Response(orden_json.errors, status=400)


    def delete(self,request,pk):
        orden = self.get_object(pk)
        orden.estado = 0
        orden.save()
        return Response(OrdenTrabajoSerializer(orden).data,status=201)


class Imgview(APIView):
    def post(self, request):
        imgs = json.loads(request.data["imagenes"])
        #return JsonResponse(imgs)

        fotos_json = FotosSerializer(data=imgs, many=True)
        if fotos_json.is_valid():
            fotos_json.save()
            return JsonResponse({
                "img": fotos_json.data
            })
        return JsonResponse({})
    def get(self,request):
        fotos = Fotos.objects.filter(orden_trabajo=46)
        fotos_json = FotosSerializer(fotos, many=True)
        return Response(fotos_json.data, status=201)

class DetailImgview(APIView):
    def post(self, request):
        foto = Fotos.objects.get(pk=request.data["id"])
        foto.delete()
        return Response({}, status=201)

class MaterialView(APIView):
    def get(self,request):
        material = Material.objects.all()
        material_json = MaterialSerializer(material,many=True)
        return Response(material_json.data, status=201)


class ExampleView(APIView):
    def get(self,request,fecha):
        fecha = parse_str_fecha(fecha)
        if PrecioRubroFecha.objects.filter(fecha_mes=fecha).exists():
            return excel_cuadro_consolidado(fecha)
        raise Http404

    parser_classes = (JSONParser,)
    renderer_classes = (JSONRenderer,)
    def post(self, request, format=None):
        actividades = request.data["actividades"]

        for act in actividades:
            _array = get_array("0", "detalle_ot_actividad", act["areas"])
            return Response(_array, status=201)




