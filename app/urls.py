from django.conf.urls import url
from .views import *
#from . import views

app_name= "app"
urlpatterns = [
    url(r'^admin/', admin),
    url(r'^o_t/', o_t),
    url(r'^contratista/$', Contratista_view.as_view()),
    url(r'^maquinarias/(?P<pk_contratista>[0-9]+)$', Maquinaria_view.as_view()),
    url(r'^list/(?P<op>[\w-]+)/', ListView.as_view()),
    #url(r'^parroquia/$', TipoMantenimiento_view.as_view()),
    #url(r'^videos-i/(?P<pk>[0-9]+)$', DetailVideo.as_view() , name='detail-video'),

]