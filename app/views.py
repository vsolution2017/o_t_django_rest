from django.shortcuts import render
#from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *

def admin(request):
    return render(request,'app/base.html',{})
def o_t(request):
    return render(request, 'app/register_ot.html', {})

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

class TipoMantenimiento_view(APIView):
    def get(self,request):
        tipo_mantenimientos = TipoMantenimiento.objects.all()
        tipo_mantenimientos_json = TipoMantenimientoSerializer(tipo_mantenimientos,many=True)
        return Response(tipo_mantenimientos_json.data)
