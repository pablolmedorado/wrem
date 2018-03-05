from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist

from rest_flex_fields import FlexFieldsModelViewSet
from rest_framework.decorators import detail_route, api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from comun.views import FlexFieldsReadOnlyModelViewSet, FlexFieldsReadAndDestroyModelViewSet, MovableViewSet
from rem.models import (
    LogREM, ObjetoREM, RequisitoREM, RequisitoInformacionREM, TipoBaseDefault, TIPOS_TRAZABLES
)
from rem.serializers import (
    ObjetoSerializer, OrganizacionSerializer, ParticipanteSerializer, CasoDeUsoSerializer, RequisitoSerializer,
    ReunionSerializer, SeccionSerializer, ParrafoSerializer, ImagenSerializer, ObjetivoSerializer, ActorSerializer,
    RequisitoInformacionSerializer, PasoCUSerializer, ExcepcionPasoSerializer, TipoObjetoSerializer,
    ComponenteSerializer, TipoValorSerializer, AtributoSerializer, ExpresionSerializer, AsociacionSerializer,
    RolSerializer, OperacionSistemaSerializer, ExcepcionOSSerializer, ParametroSerializer, ConflictoSerializer,
    AlternativaSerializer, DefectoSerializer, PeticionCambioSerializer, DatoEspecificoSerializer,
    TipoBaseDefaultSerializer, MatrizTrazabilidadSerializer, TipoTrazableSerializer
)
from rem.permissions import ObjetoPermission


class TipoBaseDefaultViewSet(FlexFieldsReadOnlyModelViewSet):
    serializer_class = TipoBaseDefaultSerializer
    queryset = TipoBaseDefault.objects.all()
    search_fields = ('nombre', 'codigo',)
    ordering = ('codigo',)


@api_view(['GET'])
def tiposTrazablesApi(request):
    queryset = ContentType.objects.filter(app_label='rem', model__in=TIPOS_TRAZABLES).order_by('model')
    serializer = TipoTrazableSerializer(queryset, many=True)
    return Response(serializer.data)


class ObjetoViewSet(MovableViewSet, FlexFieldsReadAndDestroyModelViewSet):
    serializer_class = ObjetoSerializer
    permission_classes = (ObjetoPermission,)
    filter_fields = ('documento__proyecto', 'documento', 'polymorphic_ctype',)
    search_fields = ('nombre', 'codigo',)
    ordering_fields = ('id', 'order', 'codigo',)
    ordering = ('id',)

    def get_queryset(self):
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = ObjetoREM.objects.all()
        else:
            queryset = ObjetoREM.objects.filter(
                Q(documento__proyecto__autor=self.request.user) |
                Q(documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset.select_related('polymorphic_ctype')

    @detail_route(methods=['put', 'patch'])
    def cambiar_seccion(self, request, pk=None):
        if 'seccion' not in request.data:
            return Response({'detail': 'El parámetro \'seccion\' es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        objeto = self.get_object()
        if request.data.get('seccion'):
            try:
                ObjetoREM.objects.get(pk=request.data.get('seccion'), documento=objeto.documento)
            except ObjectDoesNotExist:
                return Response(
                    {'detail': 'La sección dada no existe o pertenece a otro documento.'},
                    status=status.HTTP_404_NOT_FOUND
                )

        objeto = objeto.change_seccion(request.data.get('seccion'))
        serializer = self.get_serializer(objeto, many=False)
        return Response(serializer.data)


class ObjetoAbstractViewSet(FlexFieldsModelViewSet):
    abstract = True

    permission_classes = (ObjetoPermission,)
    filter_fields = ('documento__proyecto', 'documento',)
    search_fields = ('nombre', 'codigo',)
    ordering_fields = ('id', 'order', 'codigo',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(documento__proyecto__autor=self.request.user) |
                Q(documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object(),
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class OrganizacionViewSet(ObjetoAbstractViewSet):
    serializer_class = OrganizacionSerializer


class ParticipanteViewSet(ObjetoAbstractViewSet):
    serializer_class = ParticipanteSerializer


class ReunionViewSet(ObjetoAbstractViewSet):
    serializer_class = ReunionSerializer


class SeccionViewSet(ObjetoAbstractViewSet):
    serializer_class = SeccionSerializer


class ParrafoViewSet(ObjetoAbstractViewSet):
    serializer_class = ParrafoSerializer


class ImagenViewSet(ObjetoAbstractViewSet):
    serializer_class = ImagenSerializer

    def create(self, request, *args, **kwargs):
        if not request.data['autores']:
            del request.data['autores']
        if not request.data['fuentes']:
            del request.data['fuentes']
        if not request.data['trazabilidad_desde']:
            del request.data['trazabilidad_desde']
        return super(ImagenViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.data['autores']:
            del request.data['autores']
        if not request.data['fuentes']:
            del request.data['fuentes']
        if not request.data['trazabilidad_desde']:
            del request.data['trazabilidad_desde']
        return super(ImagenViewSet, self).update(request, *args, **kwargs)


class ObjetivoViewSet(ObjetoAbstractViewSet):
    serializer_class = ObjetivoSerializer


class ActorViewSet(ObjetoAbstractViewSet):
    serializer_class = ActorSerializer


class RequisitoInformacionViewSet(ObjetoAbstractViewSet):
    serializer_class = RequisitoInformacionSerializer


class DatoEspecificoViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = DatoEspecificoSerializer
    filter_fields = ('requisito_informacion',)
    search_fields = ('descripcion',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(requisito_informacion__documento__proyecto__autor=self.request.user) |
                Q(requisito_informacion__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.requisito_informacion,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().requisito_informacion,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class RequisitoViewSet(ObjetoAbstractViewSet):
    serializer_class = RequisitoSerializer

    def get_queryset(self):
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = RequisitoREM.objects.not_instance_of(RequisitoInformacionREM).all()
        else:
            queryset = RequisitoREM.objects.not_instance_of(RequisitoInformacionREM).filter(
                Q(documento__proyecto__autor=self.request.user) |
                Q(documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset


class CasoDeUsoViewSet(ObjetoAbstractViewSet):
    serializer_class = CasoDeUsoSerializer


class PasoCUViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = PasoCUSerializer
    filter_fields = ('caso_uso', 'tipo_accion', 'actor',)
    search_fields = ('condicion', 'acciones_realizadas',)
    ordering_fields = ('id', 'numero',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(caso_uso__documento__proyecto__autor=self.request.user) |
                Q(caso_uso__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.caso_uso,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().caso_uso,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class ExcepcionPasoCUViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = ExcepcionPasoSerializer
    filter_fields = ('paso', 'tipo_accion',)
    search_fields = ('condicion', 'acciones_realizadas',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(paso__caso_uso__documento__proyecto__autor=self.request.user) |
                Q(paso__caso_uso__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.paso.caso_uso,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().paso.caso_uso,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class MatrizTrazabilidadViewSet(ObjetoAbstractViewSet):
    serializer_class = MatrizTrazabilidadSerializer


class TipoObjetoViewSet(ObjetoAbstractViewSet):
    serializer_class = TipoObjetoSerializer


class ComponenteViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = ComponenteSerializer
    filter_fields = ('tipo_objeto', 'tipo_base', 'tipo',)
    search_fields = ('nombre', 'valor', 'descripcion',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(tipo_objeto__documento__proyecto__autor=self.request.user) |
                Q(tipo_objeto__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.tipo_objeto,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().tipo_objeto,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class TipoValorViewSet(ObjetoAbstractViewSet):
    serializer_class = TipoValorSerializer


class AtributoViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = AtributoSerializer
    filter_fields = ('tipo_objeto', 'tipo_valor', 'asociacion', 'tipo_base_default', 'tipo_base', 'tipo')
    search_fields = ('nombre', 'valor', 'descripcion',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(tipo_objeto__documento__proyecto__autor=self.request.user) |
                Q(tipo_objeto__documento__proyecto__grupos__usuarios=self.request.user) |
                Q(tipo_valor__documento__proyecto__autor=self.request.user) |
                Q(tipo_valor__documento__proyecto__grupos__usuarios=self.request.user) |
                Q(asociacion__documento__proyecto__autor=self.request.user) |
                Q(asociacion__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        padre = None
        if instance.tipo_objeto:
            padre = instance.tipo_objeto
        elif instance.tipo_valor:
            padre = instance.tipo_valor
        elif instance.asociacion:
            padre = instance.asociacion
        LogREM.objects.create(
            objeto=padre,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        instance = self.get_object()
        padre = None
        if instance.tipo_objeto:
            padre = instance.tipo_objeto
        elif instance.tipo_valor:
            padre = instance.tipo_valor
        elif instance.asociacion:
            padre = instance.asociacion
        LogREM.objects.create(
            objeto=padre,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class ExpresionViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = ExpresionSerializer
    filter_fields = ('tipo_objeto', 'tipo_valor', 'asociacion', 'operacion_sistema', 'tipo')
    search_fields = ('nombre',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(tipo_objeto__documento__proyecto__autor=self.request.user) |
                Q(tipo_objeto__documento__proyecto__grupos__usuarios=self.request.user) |
                Q(tipo_valor__documento__proyecto__autor=self.request.user) |
                Q(tipo_valor__documento__proyecto__grupos__usuarios=self.request.user) |
                Q(asociacion__documento__proyecto__autor=self.request.user) |
                Q(asociacion__documento__proyecto__grupos__usuarios=self.request.user) |
                Q(operacion_sistema__documento__proyecto__autor=self.request.user) |
                Q(operacion_sistema__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        padre = None
        if instance.tipo_objeto:
            padre = instance.tipo_objeto
        elif instance.tipo_valor:
            padre = instance.tipo_valor
        elif instance.asociacion:
            padre = instance.asociacion
        elif instance.operacion_sistema:
            padre = instance.operacion_sistema
        LogREM.objects.create(
            objeto=padre,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        instance = self.get_object()
        padre = None
        if instance.tipo_objeto:
            padre = instance.tipo_objeto
        elif instance.tipo_valor:
            padre = instance.tipo_valor
        elif instance.asociacion:
            padre = instance.asociacion
        elif instance.operacion_sistema:
            padre = instance.operacion_sistema
        LogREM.objects.create(
            objeto=padre,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class AsociacionViewSet(ObjetoAbstractViewSet):
    serializer_class = AsociacionSerializer


class RolViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = RolSerializer
    filter_fields = ('asociacion', 'tipo_base', 'tipo',)
    search_fields = ('nombre', 'valor', 'descripcion',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(asociacion__documento__proyecto__autor=self.request.user) |
                Q(asociacion__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.asociacion,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().asociacion,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class OperacionSistemaViewSet(ObjetoAbstractViewSet):
    serializer_class = OperacionSistemaSerializer


class ExcepcionOSViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = ExcepcionOSSerializer
    filter_fields = ('operacion_sistema',)
    search_fields = ('nombre',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(operacion_sistema__documento__proyecto__autor=self.request.user) |
                Q(operacion_sistema__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.operacion_sistema,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().operacion_sistema,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class ParametroViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = ParametroSerializer
    filter_fields = ('operacion_sistema', 'tipo_base_default', 'tipo_base',)
    search_fields = ('nombre', 'descripcion',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(operacion_sistema__documento__proyecto__autor=self.request.user) |
                Q(operacion_sistema__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        LogREM.objects.create(
            objeto=instance.operacion_sistema,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            objeto=self.get_object().operacion_sistema,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class ConflictoViewSet(ObjetoAbstractViewSet):
    serializer_class = ConflictoSerializer


class AlternativaViewSet(MovableViewSet, FlexFieldsModelViewSet):
    serializer_class = AlternativaSerializer
    filter_fields = ('conflicto', 'defecto',)
    search_fields = ('nombre',)
    ordering_fields = ('id', 'order',)
    ordering = ('id',)

    def get_queryset(self):
        object_class = self.serializer_class.Meta.model
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = object_class.objects.all()
        else:
            queryset = object_class.objects.filter(
                Q(conflicto__documento__proyecto__autor=self.request.user) |
                Q(conflicto__documento__proyecto__grupos__usuarios=self.request.user) |
                Q(defecto__documento__proyecto__autor=self.request.user) |
                Q(defecto__documento__proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        padre = None
        if instance.conflicto:
            padre = instance.conflicto
        elif instance.defecto:
            padre = instance.defecto
        LogREM.objects.create(
            objeto=padre,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        instance = self.get_object()
        padre = None
        if instance.conflicto:
            padre = instance.conflicto
        elif instance.defecto:
            padre = instance.defecto
        LogREM.objects.create(
            objeto=padre,
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )


class DefectoViewSet(ObjetoAbstractViewSet):
    serializer_class = DefectoSerializer


class PeticionCambioViewSet(ObjetoAbstractViewSet):
    serializer_class = PeticionCambioSerializer
