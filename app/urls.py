from django.conf.urls import url
from .views import *
#from . import views

app_name= "app"
urlpatterns = [
    url(r'^admin/', admin),
    url(r'^login/', login,name="login"),
    url(r'^o_t/', o_t, name="ot"),
    url(r'^contratista/$', Contratista_view.as_view()),
    url(r'^maquinarias/(?P<pk_contratista>[0-9]+)$', Maquinaria_view.as_view()),
    url(r'^sub_actividad/(?P<pk_actividad>[0-9]+)$', SubActividad_view.as_view()),
    url(r'^list/(?P<op>[\w-]+)/', ListView.as_view()),
    url(r'^contratista/$', Contratista_view.as_view()),
    url(r'^cargo/(?P<pk_cargo>[0-9]+)$', Cargo_view.as_view()),
    #url(r'^test/$', Cargo_view.as_view()),
    #url(r'^videos-i/(?P<pk>[0-9]+)$', DetailVideo.as_view() , name='detail-video'),

]

#TipoActividadPrecio.objects.filter(sub_actividad=4).latest('fecha_inicio')
