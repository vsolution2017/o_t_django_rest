from django.conf.urls import url
from .views import *
#from . import views

app_name= "app"
urlpatterns = [
    url(r'^admin/', admin, name="admin"),
    url(r'^login/', login,name="login"),
    url(r'^list_ot/', list_ot,name="list_ot"),

    url(r'^o_t/$', o_t_register,name="o_t"),
    url(r'^o_t/(?P<pk>[0-9]+)$', o_t_update,name="ot_update"),
    url(r'^s_OrdenTrabajo/$', Orden_TrabajoView.as_view(),name="test"),
    url(r'^s_OrdenTrabajo/(?P<pk>[0-9]+)$', Detail_Orden_TrabajoView.as_view(),name="d_Orden_trabajo"),
    url(r'^settings/', settings, name="settings"),
    url(r'^s_PrecioRubro/$', PrecioRubroView.as_view(), name="s_PrecioRubro"),
    url(r'^s_PrecioRubro/(?P<pk>[0-9]+)/(?P<op>[\w-]+)$', Detail_PrecioRubroView.as_view(), name="d_PrecioRubro"),
    url(r'^s_PrecioRubro/(?P<pk>\d{8})/(?P<op>[\w-]+)$', Detail_PrecioRubroView.as_view(), name="d_PrecioRubro"),
    url(r'^contratista/$', Contratista_view.as_view()),
    url(r'^maquinarias/(?P<pk_contratista>[0-9]+)$', Maquinaria_view.as_view()),
    url(r'^sub_actividad/(?P<pk_actividad>[0-9]+)$', SubActividad_view.as_view()),
    url(r'^list/(?P<op>[\w-]+)/', ListView.as_view()),
    url(r'^contratista/$', Contratista_view.as_view()),
    url(r'^cargo/(?P<pk_cargo>[0-9]+)$', Cargo_view.as_view()),
    url(r'^g_cconsolidado/(?P<fecha>\d{8})$', ExampleView.as_view()),

    #url(r'^test/(?P<fecha>\d{8})$', ExampleView.as_view()),
    #url(r'^test/$', ExampleView.as_view(),name="gen_excel"),
    #url(r'^c_consolidado/', c_consolidado,name="c_consolidado"),
    #url(r'^test/$', test),

]

#TipoActividadPrecio.objects.filter(sub_actividad=4).latest('fecha_inicio')
