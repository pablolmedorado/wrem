from rest_framework import mixins, viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from rest_flex_fields.views import FlexFieldsMixin


class FlexFieldsReadOnlyModelViewSet(FlexFieldsMixin, viewsets.ReadOnlyModelViewSet):
    pass


class FlexFieldsReadAndDestroyModelViewSet(
    FlexFieldsMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    pass


class MovableViewSet(viewsets.GenericViewSet):
    @detail_route(methods=['put', 'patch'])
    def mover_arriba(self, request, pk=None):
        objeto = self.get_object()
        objeto.up()
        serializer = self.get_serializer(objeto, many=False)
        return Response(serializer.data)

    @detail_route(methods=['put', 'patch'])
    def mover_abajo(self, request, pk=None):
        objeto = self.get_object()
        objeto.down()
        serializer = self.get_serializer(objeto, many=False)
        return Response(serializer.data)

    @detail_route(methods=['put', 'patch'])
    def mover_inicio(self, request, pk=None):
        objeto = self.get_object()
        objeto.top()
        objeto = self.get_object()
        serializer = self.get_serializer(objeto, many=False)
        return Response(serializer.data)

    @detail_route(methods=['put', 'patch'])
    def mover_fin(self, request, pk=None):
        objeto = self.get_object()
        objeto.bottom()
        objeto = self.get_object()
        serializer = self.get_serializer(objeto, many=False)
        return Response(serializer.data)

    @detail_route(methods=['put', 'patch'])
    def mover_a_posicion(self, request, pk=None):
        if request.data['posicion']:
            objeto = self.get_object()
            objeto.to(int(request.data['posicion']))
            objeto = self.get_object()
            serializer = self.get_serializer(objeto, many=False)
            return Response(serializer.data)
        else:
            return Response("Es necesario el parámetro posicion.", status=status.HTTP_400_BAD_REQUEST)
