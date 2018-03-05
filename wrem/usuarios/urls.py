from django.conf.urls import url

from usuarios import views

urlpatterns = [
    url(r'^validar_email/(?P<uidb64>\w+)/(?P<token>\w+)/$', views.validar_email, name='validar_email'),
]