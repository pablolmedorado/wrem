from django.db.models import Q

from rest_flex_fields import FlexFieldsModelViewSet, is_expanded

from rem.models import DocumentoREM, LogREM
from rem.serializers import DocumentoSerializer
from rem.permissions import DocumentoPermission


class DocumentoViewSet(FlexFieldsModelViewSet):
    serializer_class = DocumentoSerializer
    permission_classes = (DocumentoPermission,)
    filter_fields = ('proyecto', 'autor',)
    search_fields = ('nombre',)
    ordering_fields = ('id', 'nombre', 'creado',)
    ordering = ('id',)

    AVAILABLE_SELECT_RELATED_FIELDS = ['proyecto', 'autor', 'organizacion_por', 'organizacion_para']

    def get_queryset(self):
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = DocumentoREM.objects.all()
        else:
            queryset = DocumentoREM.objects.filter(
                Q(autor=self.request.user) |
                Q(proyecto__grupos__usuarios=self.request.user)
            ).distinct('pk')

        select_related_fields = []
        for field in self.AVAILABLE_SELECT_RELATED_FIELDS:
            if is_expanded(self.request, field):
                select_related_fields.append(field)
        if select_related_fields:
            queryset = queryset.select_related(*select_related_fields)

        if is_expanded(self.request, 'logs'):
            queryset = queryset.prefetch_related('logs')

        return queryset

    def perform_create(self, serializer):
        instance = serializer.save(autor=self.request.user)
        LogREM.objects.create(
            documento=instance,
            descripcion='Creado por {usuario}'.format(usuario=self.request.user)
        )

    def perform_update(self, serializer):
        serializer.save()
        LogREM.objects.create(
            documento=self.get_object(),
            descripcion='Modificado por {usuario}'.format(usuario=self.request.user)
        )
