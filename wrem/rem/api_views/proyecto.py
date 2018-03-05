from datetime import datetime

from django.db.models import Q

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import detail_route

from rest_flex_fields import FlexFieldsModelViewSet, is_expanded

from rem.models import ProyectoREM, LogREM
from rem.serializers import ProyectoSerializer
from rem.permissions import ProyectoPermission


class ProyectoViewSet(FlexFieldsModelViewSet):
    serializer_class = ProyectoSerializer
    permission_classes = (ProyectoPermission,)
    filter_fields = ('autor', 'grupos')
    search_fields = ('nombre',)
    ordering_fields = ('id', 'nombre', 'creado', 'fecha_ultima_apertura')
    ordering = ('id',)

    def get_queryset(self):
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = ProyectoREM.objects.all()
        else:
            queryset = ProyectoREM.objects.filter(
                Q(autor=self.request.user) |
                Q(grupos__usuarios=self.request.user)
            ).distinct('pk')
        if is_expanded(self.request, 'autor'):
            queryset = queryset.select_related('autor')
        if is_expanded(self.request, 'usuario_ultima_apertura'):
            queryset = queryset.select_related('usuario_ultima_apertura')
        if is_expanded(self.request, 'logs'):
            queryset = queryset.prefetch_related('logs')
        return queryset.prefetch_related('documentos', 'grupos')

    def perform_create(self, serializer):
        instance = serializer.save(autor=self.request.user)
        LogREM.objects.create(
            proyecto=instance,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            proyecto=self.get_object(),
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )

    @detail_route(methods=['patch'])
    def actualizar_apertura(self, request, pk=None):
        proyecto = self.get_object()
        proyecto.fecha_ultima_apertura = datetime.now()
        proyecto.usuario_ultima_apertura = request.user
        proyecto.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
