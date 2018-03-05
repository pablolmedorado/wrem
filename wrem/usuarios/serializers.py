from rest_framework import serializers

from rest_flex_fields import FlexFieldsModelSerializer

from usuarios.models import Usuario, Grupo


class GrupoSerializer(FlexFieldsModelSerializer):
    proyectos = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Grupo
        fields = ('id', 'nombre', 'administrador', 'usuarios', 'proyectos',)

    expandable_fields = {
        'administrador': (
            'usuarios.serializers.UsuarioSerializer',
            {'source': 'administrador', 'fields': ['id', 'email', 'full_name'], 'many': False}
        ),
        'usuarios': (
            'usuarios.serializers.UsuarioSerializer',
            {'source': 'usuarios', 'fields': ['id', 'email', 'full_name'], 'many': True}
        ),
        'proyectos': (
            'rem.serializers.ProyectoSerializer',
            {'source': 'proyectos', 'fields': ['id', 'nombre'], 'many': True}
        )
    }


class UsuarioSerializer(FlexFieldsModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    password = serializers.CharField(write_only=True)
    grupos = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Usuario
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'full_name', 'grupos',)

    expandable_fields = {
        'grupos': (
            'usuarios.serializers.GrupoSerializer',
            {'source': 'grupos', 'fields': ['id', 'nombre'], 'many': True}
        )
    }
