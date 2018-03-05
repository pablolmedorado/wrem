from django.conf.urls import include, url

from rest_framework import routers

from usuarios import api_views


# Urls from viewsets
router = routers.DefaultRouter()
router.register(r'usuarios', api_views.UsuarioViewSet, base_name='Usuario')
router.register(r'grupos', api_views.GrupoViewSet, base_name='Grupo')

urlpatterns = router.urls

urlpatterns += [
    url(r'^selectusuarios/', api_views.selectUsuariosApi)
]
