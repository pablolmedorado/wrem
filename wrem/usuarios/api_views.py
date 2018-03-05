from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from rest_flex_fields import FlexFieldsModelViewSet

from usuarios.models import Usuario, Grupo
from usuarios.serializers import UsuarioSerializer, GrupoSerializer
from usuarios.permissions import UsuarioPermission, GrupoPermission


class UsuarioViewSet(FlexFieldsModelViewSet):
    queryset = Usuario.objects.all().prefetch_related('grupos')
    serializer_class = UsuarioSerializer
    permission_classes = (UsuarioPermission,)
    filter_fields = ('grupos',)
    search_fields = ('first_name', 'last_name', 'email',)
    ordering_fields = ('id',)
    ordering = ('id',)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = Usuario.objects.create_user(**request.data)

        serializer = self.get_serializer(instance=user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GrupoViewSet(FlexFieldsModelViewSet):
    serializer_class = GrupoSerializer
    permission_classes = (GrupoPermission,)
    filter_fields = ('administrador',)
    search_fields = ('nombre',)
    ordering_fields = ('id', 'nombre',)
    ordering = ('id',)

    def get_queryset(self):
        action = self.get_serializer_context()['view'].action
        if self.request.user.is_staff or not action == 'list':
            queryset = Grupo.objects.all()
        else:
            queryset = Grupo.objects.filter(
                Q(usuarios=self.request.user) |
                Q(administrador=self.request.user)
            ).distinct('pk')
        return queryset.prefetch_related('usuarios', 'proyectos')


@api_view(['GET'])
def selectUsuariosApi(request):
    queryset = Usuario.objects.all().order_by('first_name')
    serializer = UsuarioSerializer(queryset, fields=['id', 'full_name'], many=True)
    return Response(serializer.data)
