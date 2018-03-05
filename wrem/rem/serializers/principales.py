from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from rem.models import LogREM, ProyectoREM, DocumentoREM


class LogSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = LogREM
        fields = ('id', 'proyecto', 'documento', 'objeto', 'fecha', 'descripcion',)


class DocumentoSerializer(FlexFieldsModelSerializer):
    editable = serializers.SerializerMethodField()

    class Meta:
        model = DocumentoREM
        fields = (
            'id', 'proyecto', 'nombre', 'autor', 'version', 'organizacion_por', 'organizacion_para', 'comentarios',
            'creado', 'modificado', 'editable',
        )
        read_only_fields = ('creado', 'modificado',)

    expandable_fields = {
        'proyecto': (
            'rem.serializers.ProyectoSerializer',
            {'source': 'proyecto', 'fields': ['id', 'nombre', 'fecha_ultima_apertura', 'usuario_ultima_apertura'], 'many': False}
        ),
        'organizacion_por': (
            'rem.serializers.ObjetoSimpleSerializer',
            {'source': 'organizacion_por', 'fields': ['id', 'codigo', 'nombre'], 'many': False}
        ),
        'organizacion_para': (
            'rem.serializers.ObjetoSimpleSerializer',
            {'source': 'organizacion_para', 'fields': ['id', 'codigo', 'nombre'], 'many': False}
        ),
        'autor': (
            'usuarios.serializers.UsuarioSerializer',
            {'source': 'autor', 'fields': ['id', 'email', 'full_name'], 'many': False}
        ),
        'logs': (LogSerializer, {'source': 'logs', 'fields': ['fecha', 'descripcion'], 'many': True})
    }

    def get_editable(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            return obj.proyecto.can_be_modified_by(user)
        return False

    def validate(self, data):
        if 'organizacion_por' in data:
            if data['organizacion_por'] and data['organizacion_por'].documento.proyecto != data['proyecto']:
                raise serializers.ValidationError("la organización origen debe pertenecer al mismo proyecto que el documento")
        if 'organizacion_para' in data:
            if data['organizacion_para'] and data['organizacion_para'].documento.proyecto != data['proyecto']:
                raise serializers.ValidationError("la organización destino debe pertenecer al mismo proyecto que el documento")
        return data


class ProyectoSerializer(FlexFieldsModelSerializer):
    documentos = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    editable = serializers.SerializerMethodField()

    class Meta:
        model = ProyectoREM
        fields = (
            'id', 'nombre', 'autor', 'fecha_ultima_apertura', 'usuario_ultima_apertura', 'grupos', 'documentos',
            'creado', 'modificado', 'editable',
        )
        read_only_fields = ('creado', 'modificado',)

    def get_editable(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            return obj.can_be_modified_by(user)
        return False

    expandable_fields = {
        'autor': (
            'usuarios.serializers.UsuarioSerializer',
            {'source': 'autor', 'fields': ['id', 'email', 'full_name'], 'many': False}
        ),
        'usuario_ultima_apertura': (
            'usuarios.serializers.UsuarioSerializer',
            {'source': 'usuario_ultima_apertura', 'fields': ['id', 'email', 'full_name'], 'many': False}
        ),
        'logs': (LogSerializer, {'source': 'logs', 'fields': ['fecha', 'descripcion'], 'many': True})
    }
