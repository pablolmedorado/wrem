from django.contrib.contenttypes.models import ContentType

from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from rem.models.objetos import (
    ObjetoREM,
    OrganizacionREM, ParticipanteREM, ReunionREM, SeccionREM, ParrafoREM, ImagenREM,
    ObjetivoREM, ActorREM, RequisitoREM, RequisitoInformacionREM, CasoDeUsoREM,
    ExcepcionPasoCUREM, PasoCUREM, TipoObjetoREM, ComponenteREM, TipoValorREM,
    AtributoREM, ExpresionREM, AsociacionREM, RolREM, OperacionSistemaREM, ExcepcionOSREM,
    ConflictoREM, AlternativaREM, DefectoREM, PeticionCambioREM, ParametroREM, DatoEspecificoREM, TipoBaseDefault,
    MatrizTrazabilidadREM
)
from rem.serializers import LogSerializer


class TipoBaseDefaultSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = TipoBaseDefault
        fields = ['id', 'codigo', 'nombre']


class TipoTrazableSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ContentType
        fields = ['id', 'model']


class ObjetoAbstractMeta:
    abstract = True
    fields = [
        'id', 'tipo_objeto', 'documento', 'numero', 'codigo', 'order', 'nombre', 'version', 'fecha_version', 'autores',
        'fuentes', 'comentarios', 'trazabilidad_desde', 'seccion',
    ]


class ObjetoAbstractSerializer(FlexFieldsModelSerializer):
    abstract = True

    tipo_objeto = serializers.SlugRelatedField(
        source='polymorphic_ctype', slug_field='model', many=False, read_only=True
    )
    numero = serializers.IntegerField(read_only=True)
    codigo = serializers.CharField(read_only=True)
    order = serializers.IntegerField(read_only=True)

    expandable_fields = {
        'logs': (LogSerializer, {'source': 'logs', 'fields': ['fecha', 'descripcion'], 'many': True})
    }

    def validate(self, data):
        if 'autores' in data:
            for objeto in data['autores']:
                if objeto.documento.proyecto != data['documento'].proyecto:
                    raise serializers.ValidationError("los autores deben pertenecer al mismo proyecto que el objeto")
        if 'fuentes' in data:
            for objeto in data['fuentes']:
                if objeto.documento.proyecto != data['documento'].proyecto:
                    raise serializers.ValidationError("los fuentes deben pertenecer al mismo proyecto que el objeto")
        if 'trazabilidad_desde' in data:
            for objeto in data['trazabilidad_desde']:
                if objeto.documento.proyecto != data['documento'].proyecto:
                    raise serializers.ValidationError(
                        "los objetos trazados deben pertenecer al mismo proyecto que el objeto"
                    )
        return data


class OrganizacionSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = OrganizacionREM
        fields = ObjetoAbstractMeta.fields + ['direccion', 'telefono', 'email']


class ParticipanteSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ParticipanteREM
        fields = ObjetoAbstractMeta.fields + ['organizacion', 'rol', 'es_cliente', 'es_desarrollador', 'es_usuario']

    def validate(self, data):
        if 'organizacion' in data:
            if data['organizacion'] and data['organizacion'].documento.proyecto != data['documento'].proyecto:
                raise serializers.ValidationError(
                    "la organización debe pertenecer al mismo proyecto que el participante"
                )
        return super(ParticipanteSerializer, self).validate(data)


class ReunionSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ReunionREM
        fields = ObjetoAbstractMeta.fields + ['lugar', 'fecha', 'asistentes', 'resultados']

    def validate(self, data):
        if 'asistentes' in data:
            for objeto in data['asistentes']:
                if objeto.documento.proyecto != data['documento'].proyecto:
                    raise serializers.ValidationError(
                        "los asistentes deben pertenecer al mismo proyecto que la reunión"
                    )
        return super(ReunionSerializer, self).validate(data)


class SeccionSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = SeccionREM
        fields = ObjetoAbstractMeta.fields


class ParrafoSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ParrafoREM
        fields = ObjetoAbstractMeta.fields + ['texto']


class ImagenSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ImagenREM
        fields = ObjetoAbstractMeta.fields + ['imagen']


class ObjetivoSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ObjetivoREM
        fields = ObjetoAbstractMeta.fields + [
            'padre', 'descripcion', 'importancia', 'urgencia', 'estado_desarrollo', 'estabilidad'
        ]

    def validate(self, data):
        if 'padre' in data:
            if data['padre'] and data['padre'].documento.proyecto != data['documento'].proyecto:
                raise serializers.ValidationError("el padre debe pertenecer al mismo proyecto que el propio objetivo")
        return super(ObjetivoSerializer, self).validate(data)


class ActorSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ActorREM
        fields = ObjetoAbstractMeta.fields + ['descripcion']


class DatoEspecificoSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = DatoEspecificoREM
        fields = ['id', 'requisito_informacion', 'order', 'descripcion', 'comentarios', ]


class RequisitoInformacionSerializer(ObjetoAbstractSerializer):
    datos_especificos = DatoEspecificoSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = RequisitoInformacionREM
        fields = ObjetoAbstractMeta.fields + [
            'tipo', 'descripcion', 'importancia', 'urgencia', 'estado_desarrollo', 'estabilidad',
            'tiempo_vida_max', 'tiempo_vida_med', 'tiempo_vida_max_ud', 'tiempo_vida_med_ud',
            'ocurrencias_simultaneas_max', 'ocurrencias_simultaneas_med', 'datos_especificos'
        ]


class RequisitoSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = RequisitoREM
        fields = ObjetoAbstractMeta.fields + [
            'tipo', 'descripcion', 'importancia', 'urgencia', 'estado_desarrollo', 'estabilidad'
        ]

    def to_representation(self, obj):
        if isinstance(obj, RequisitoInformacionREM):
            try:
                serializer = type('DynamicFieldsModelSerializer', (RequisitoInformacionSerializer,), {
                    'expand': self.expand,
                    'include_fields': self.include_fields,
                })
            except AttributeError:
                serializer = RequisitoInformacionSerializer
            return serializer(obj, context=self.context).to_representation(obj)
        return super(RequisitoSerializer, self).to_representation(obj)


class ExcepcionPasoSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ExcepcionPasoCUREM
        fields = [
            'id', 'paso', 'order', 'condicion', 'terminacion', 'tipo_accion', 'actor', 'inclusion_extension',
            'acciones_realizadas', 'rendimiento', 'rendimiento_ud', 'comentarios'
        ]

    def validate(self, data):
        if 'actor' in data:
            if data['actor'] and data['actor'].documento.proyecto != data['paso'].caso_uso.documento.proyecto:
                raise serializers.ValidationError("el actor debe pertenecer al mismo proyecto que el caso de uso")
        if 'inclusion_extension' in data:
            if data['inclusion_extension'] and data['inclusion_extension'].documento.proyecto != data['paso'].caso_uso.documento.proyecto:
                raise serializers.ValidationError("el caso de uso a incluir/extender debe pertenecer al mismo proyecto que el caso de uso")
        return super(ExcepcionPasoSerializer, self).validate(data)


class PasoCUSerializer(FlexFieldsModelSerializer):
    excepciones = ExcepcionPasoSerializer(many=True, read_only=True)

    class Meta:
        model = PasoCUREM
        fields = [
            'id', 'caso_uso', 'order', 'es_condicional', 'condicion', 'tipo_accion', 'actor', 'inclusion_extension',
            'acciones_realizadas', 'rendimiento', 'rendimiento_ud', 'comentarios', 'excepciones'
        ]

    def validate(self, data):
        if 'actor' in data:
            if data['actor'] and data['actor'].documento.proyecto != data['caso_uso'].documento.proyecto:
                raise serializers.ValidationError("el actor debe pertenecer al mismo proyecto que el caso de uso")
        if 'inclusion_extension' in data:
            if data['inclusion_extension'] and data['inclusion_extension'].documento.proyecto != data['caso_uso'].documento.proyecto:
                raise serializers.ValidationError("el caso de uso a incluir/extender debe pertenecer al mismo proyecto que el caso de uso")
        return super(PasoCUSerializer, self).validate(data)


class CasoDeUsoSerializer(ObjetoAbstractSerializer):
    pasos = PasoCUSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = CasoDeUsoREM
        fields = ObjetoAbstractMeta.fields + [
            'es_abstracto', 'evento_activacion', 'frecuencia', 'frecuencia_ud', 'precondicion', 'postcondicion',
            'importancia', 'urgencia', 'estado_desarrollo', 'estabilidad', 'pasos'
        ]


class ComponenteSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ComponenteREM
        fields = [
            'id', 'tipo_objeto', 'order', 'nombre', 'tipo_base', 'tipo', 'multiplicidad_inferior', 'multiplicidad_superior',
            'tipo_propiedad', 'valor', 'descripcion', 'comentarios'
        ]

    def validate(self, data):
        if 'tipo_base' in data:
            if data['tipo_base'] and data['tipo_base'].documento.proyecto != data['tipo_objeto'].documento.proyecto:
                raise serializers.ValidationError(
                    "el tipo base debe pertenecer al mismo proyecto que el tipo de objeto"
                )
        return super(ComponenteSerializer, self).validate(data)


class AtributoSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = AtributoREM
        fields = [
            'id', 'tipo_objeto', 'tipo_valor', 'asociacion', 'order', 'nombre', 'tipo_base_default', 'tipo_base', 'tipo',
            'multiplicidad_inferior', 'multiplicidad_superior', 'tipo_propiedad', 'valor', 'descripcion', 'comentarios'
        ]

    def validate(self, data):
        tipo_padre = None
        contador_padres = 0
        if 'tipo_objeto' in data:
            if data['tipo_objeto']:
                tipo_padre = 'tipo_objeto'
                contador_padres += 1
        if 'tipo_valor' in data:
            if data['tipo_valor']:
                tipo_padre = 'tipo_valor'
                contador_padres += 1
        if 'asociacion' in data:
            if data['asociacion']:
                tipo_padre = 'asociacion'
                contador_padres += 1
        if contador_padres < 1:
            raise serializers.ValidationError(
                "el atributo debe pertenecer tipo de objeto, un tipo de valor o una asociación"
            )
        if contador_padres > 1:
            raise serializers.ValidationError(
                "el atributo debe pertenecer sólo a un tipo de objeto, un tipo de valor o una asociación"
            )
        if 'tipo_base' in data:
            if data['tipo_base'] and data['tipo_base'].documento.proyecto != data[tipo_padre].documento.proyecto:
                raise serializers.ValidationError(
                    "el tipo base debe pertenecer al mismo proyecto que el padre de este atributo"
                )
        return super(AtributoSerializer, self).validate(data)


class ExpresionSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ExpresionREM
        fields = [
            'id', 'tipo_objeto', 'tipo_valor', 'asociacion', 'operacion_sistema', 'order', 'nombre', 'tipo',
            'expresion_lenguaje_natural', 'expresion_ocl', 'comentarios'
        ]

    def validate(self, data):
        contador_padres = 0
        if 'tipo_objeto' in data:
            if data['tipo_objeto']:
                contador_padres += 1
        if 'tipo_valor' in data:
            if data['tipo_valor']:
                contador_padres += 1
        if 'asociacion' in data:
            if data['asociacion']:
                contador_padres += 1
        if 'operacion_sistema' in data:
            if data['operacion_sistema']:
                contador_padres += 1
        if contador_padres < 1:
            raise serializers.ValidationError(
                "la expresión debe pertenecer tipo de objeto, un tipo de valor, una asociación o una \
                operacion de sistema"
            )
        if contador_padres > 1:
            raise serializers.ValidationError(
                "la expresión debe pertenecer sólo a un tipo de objeto, un tipo de valor, una asociación o \
                una operacion de sistema"
            )
        return super(ExpresionSerializer, self).validate(data)


class TipoObjetoSerializer(ObjetoAbstractSerializer):
    componentes = ComponenteSerializer(many=True, read_only=True)
    atributos = AtributoSerializer(many=True, read_only=True)
    expresiones = ExpresionSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = TipoObjetoREM
        fields = ObjetoAbstractMeta.fields + [
            'es_abstracto', 'supertipo', 'subtipo', 'descripcion', 'componentes', 'atributos', 'expresiones'
        ]

    def validate(self, data):
        if 'supertipo' in data:
            if data['supertipo'] and data['supertipo'].documento.proyecto != data['documento'].proyecto:
                raise serializers.ValidationError(
                    "el supertipo debe pertenecer al mismo proyecto que el tipo de objeto"
                )
        return super(TipoObjetoSerializer, self).validate(data)


class MatrizTrazabilidadSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = MatrizTrazabilidadREM
        fields = ObjetoAbstractMeta.fields + ['tipo_filas', 'subtipo_filas', 'tipo_columnas', 'subtipo_columnas']


class TipoValorSerializer(ObjetoAbstractSerializer):
    atributos = AtributoSerializer(many=True, read_only=True)
    expresiones = ExpresionSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = TipoValorREM
        fields = ObjetoAbstractMeta.fields + ['definicion', 'descripcion', 'atributos', 'expresiones']


class RolSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = RolREM
        fields = [
            'id', 'asociacion', 'order', 'nombre', 'tipo_base', 'tipo', 'multiplicidad_inferior', 'multiplicidad_superior',
            'tipo_propiedad', 'valor', 'descripcion', 'comentarios'
        ]

    def validate(self, data):
        if 'tipo_base' in data:
            if data['tipo_base'] and data['tipo_base'].documento.proyecto != data['asociacion'].documento.proyecto:
                raise serializers.ValidationError("el tipo base debe pertenecer al mismo proyecto que la asociación")
        return super(RolSerializer, self).validate(data)


class AsociacionSerializer(ObjetoAbstractSerializer):
    roles = RolSerializer(many=True, read_only=True)
    atributos = AtributoSerializer(many=True, read_only=True)
    expresiones = ExpresionSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = AsociacionREM
        fields = ObjetoAbstractMeta.fields + [
            'es_derivada', 'descripcion', 'roles', 'atributos', 'expresiones'
        ]


class ExcepcionOSSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ExcepcionOSREM
        fields = [
            'id', 'operacion_sistema', 'order', 'nombre', 'condicion_lenguaje_natural', 'condicion_ocl',
            'expresion_lenguaje_natural', 'expresion_ocl', 'comentarios'
        ]


class ParametroSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = ParametroREM
        fields = [
            'id', 'operacion_sistema', 'order', 'nombre', 'tipo_base_default', 'tipo_base', 'tipo',
            'multiplicidad_inferior', 'multiplicidad_superior', 'descripcion', 'comentarios'
        ]

    def validate(self, data):
        if 'tipo_base' in data:
            if data['tipo_base'] and data['tipo_base'].documento.proyecto != data['operacion_sistema'].documento.proyecto:
                raise serializers.ValidationError(
                    "el tipo base debe pertenecer al mismo proyecto que la operacion de sistema"
                )
        return super(ParametroSerializer, self).validate(data)


class OperacionSistemaSerializer(ObjetoAbstractSerializer):
    excepciones = ExcepcionOSSerializer(many=True, read_only=True)
    expresiones = ExpresionSerializer(many=True, read_only=True)
    parametros = ParametroSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = OperacionSistemaREM
        fields = ObjetoAbstractMeta.fields + [
            'tipo_resultado', 'descripcion', 'excepciones', 'expresiones', 'parametros'
        ]


class AlternativaSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = AlternativaREM
        fields = ['id', 'conflicto', 'defecto', 'order', 'nombre', 'autores', 'descripcion', 'comentarios']

    def validate(self, data):
        tipo_padre = None
        contador_padres = 0
        if 'conflicto' in data:
            if data['conflicto']:
                tipo_padre = 'conflicto'
                contador_padres += 1
        if 'defecto' in data:
            if data['defecto']:
                tipo_padre = 'defecto'
                contador_padres += 1
        if contador_padres < 1:
            raise serializers.ValidationError("la alternativa debe pertenecer a un conflicto o un defecto")
        if contador_padres > 1:
            raise serializers.ValidationError(
                "la alternativa debe pertenecer sólo a un tipo de objeto, un tipo de valor o una asociación"
            )
        if 'autores' in data:
            for objeto in data['autores']:
                if objeto.documento.proyecto != data[tipo_padre].documento.proyecto:
                    raise serializers.ValidationError(
                        "los autores deben pertenecer al mismo proyecto que el padre de esta alternativa"
                    )
        return super(AlternativaSerializer, self).validate(data)


class ConflictoSerializer(ObjetoAbstractSerializer):
    alternativas = AlternativaSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = ConflictoREM
        fields = ObjetoAbstractMeta.fields + [
            'descripcion', 'solucion', 'importancia', 'urgencia', 'estado', 'alternativas'
        ]


class DefectoSerializer(ObjetoAbstractSerializer):
    alternativas = AlternativaSerializer(many=True, read_only=True)

    class Meta(ObjetoAbstractMeta):
        model = DefectoREM
        fields = ObjetoAbstractMeta.fields + [
            'tipo', 'descripcion', 'solucion', 'importancia', 'urgencia', 'estado', 'alternativas'
        ]

    def validate(self, data):
        return super(DefectoSerializer, self).validate(data)


class PeticionCambioSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = PeticionCambioREM
        fields = ObjetoAbstractMeta.fields + [
            'descripcion', 'analisis', 'importancia', 'urgencia', 'estado'
        ]

    def validate(self, data):
        return super(PeticionCambioSerializer, self).validate(data)


class ObjetoSerializer(ObjetoAbstractSerializer):
    class Meta(ObjetoAbstractMeta):
        model = ObjetoREM

    def to_representation(self, obj):
        serializer_class = None

        if isinstance(obj, OrganizacionREM):
            serializer_class = OrganizacionSerializer
        if isinstance(obj, ParticipanteREM):
            serializer_class = ParticipanteSerializer
        if isinstance(obj, ReunionREM):
            serializer_class = ReunionSerializer
        if isinstance(obj, SeccionREM):
            serializer_class = SeccionSerializer
        if isinstance(obj, ParrafoREM):
            serializer_class = ParrafoSerializer
        if isinstance(obj, ImagenREM):
            serializer_class = ImagenSerializer
        if isinstance(obj, ObjetivoREM):
            serializer_class = ObjetivoSerializer
        if isinstance(obj, ActorREM):
            serializer_class = ActorSerializer
        if isinstance(obj, RequisitoREM):
            serializer_class = RequisitoSerializer
        if isinstance(obj, CasoDeUsoREM):
            serializer_class = CasoDeUsoSerializer
        if isinstance(obj, MatrizTrazabilidadREM):
            serializer_class = MatrizTrazabilidadSerializer
        if isinstance(obj, TipoObjetoREM):
            serializer_class = TipoObjetoSerializer
        if isinstance(obj, TipoValorREM):
            serializer_class = TipoValorSerializer
        if isinstance(obj, AsociacionREM):
            serializer_class = AsociacionSerializer
        if isinstance(obj, OperacionSistemaREM):
            serializer_class = OperacionSistemaSerializer
        if isinstance(obj, ConflictoREM):
            serializer_class = ConflictoSerializer
        if isinstance(obj, DefectoREM):
            serializer_class = DefectoSerializer
        if isinstance(obj, PeticionCambioREM):
            serializer_class = PeticionCambioSerializer

        if serializer_class:
            try:
                serializer = type('DynamicFieldsModelSerializer', (serializer_class,), {
                    'expand': self.expand,
                    'include_fields': self.include_fields,
                })
            except AttributeError:
                serializer = serializer_class
            return serializer(obj, context=self.context).to_representation(obj)
        else:
            return super(ObjetoSerializer, self).to_representation(obj)
