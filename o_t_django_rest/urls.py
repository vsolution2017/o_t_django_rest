from django.conf.urls import url,include
from django.contrib import admin
app_name= "admin"
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^app/', include('app.urls')),
]
