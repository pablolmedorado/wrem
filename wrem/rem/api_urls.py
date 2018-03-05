from django.conf.urls import include, url

from rest_framework import routers

from rem import api_views


# Urls from viewsets
router = routers.DefaultRouter()
router.register(r'proyectos', api_views.ProyectoViewSet, base_name='ProyectoREM')
router.register(r'documentos', api_views.DocumentoViewSet, base_name='DocumentoREM')
router.register(r'objetos', api_views.ObjetoViewSet, base_name='ObjetoREM')

router.register(r'organizaciones', api_views.OrganizacionViewSet, base_name='OrganizacionREM')
router.register(r'participantes', api_views.ParticipanteViewSet, base_name='ParticipanteREM')
router.register(r'reuniones', api_views.ReunionViewSet, base_name='ReunionREM')
router.register(r'secciones', api_views.SeccionViewSet, base_name='SeccionREM')
router.register(r'parrafos', api_views.ParrafoViewSet, base_name='ParrafoREM')
router.register(r'imagenes', api_views.ImagenViewSet, base_name='ImagenREM')
router.register(r'objetivos', api_views.ObjetivoViewSet, base_name='ObjetivoREM')
router.register(r'actores', api_views.ActorViewSet, base_name='ActorREM')
router.register(r'requisitos', api_views.RequisitoViewSet, base_name='RequisitoREM')
router.register(r'requisitosinformacion', api_views.RequisitoInformacionViewSet, base_name='RequisitoInformacionREM')
router.register(r'casosdeuso', api_views.CasoDeUsoViewSet, base_name='CasoDeUsoREM')
router.register(r'pasoscu', api_views.PasoCUViewSet, base_name='PasoCUREM')
router.register(r'excepcionespasoscu', api_views.ExcepcionPasoCUViewSet, base_name='ExcepcionPasoCUREM')
router.register(r'matricestrazabilidad', api_views.MatrizTrazabilidadViewSet, base_name='MatrizTrazabilidadREM')
router.register(r'tiposobjeto', api_views.TipoObjetoViewSet, base_name='TipoObjetoREM')
router.register(r'componentes', api_views.ComponenteViewSet, base_name='ComponenteREM')
router.register(r'tiposvalor', api_views.TipoValorViewSet, base_name='TipoValorREM')
router.register(r'atributos', api_views.AtributoViewSet, base_name='AtributoREM')
router.register(r'expresiones', api_views.ExpresionViewSet, base_name='ExpresionREM')
router.register(r'asociaciones', api_views.AsociacionViewSet, base_name='AsociacionREM')
router.register(r'roles', api_views.RolViewSet, base_name='RolREM')
router.register(r'operacionessistema', api_views.OperacionSistemaViewSet, base_name='OperacionSistemaREM')
router.register(r'excepcionesos', api_views.ExcepcionOSViewSet, base_name='ExcepcionOSREM')
router.register(r'parametros', api_views.ParametroViewSet, base_name='ParametroREM')
router.register(r'conflictos', api_views.ConflictoViewSet, base_name='ConflictoREM')
router.register(r'alternativas', api_views.AlternativaViewSet, base_name='AlternativaREM')
router.register(r'defectos', api_views.DefectoViewSet, base_name='DefectoREM')
router.register(r'peticionescambio', api_views.PeticionCambioViewSet, base_name='PeticionCambioREM')
router.register(r'datosespecificos', api_views.DatoEspecificoViewSet, base_name='DatoEspecificoREM')
router.register(r'tiposbasedefault', api_views.TipoBaseDefaultViewSet, base_name='TipoBaseDefault')

urlpatterns = router.urls

urlpatterns += [
    url(r'^tipostrazables/', api_views.tiposTrazablesApi)
]
