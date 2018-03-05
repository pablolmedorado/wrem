from importlib import import_module
from datetime import date

from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.db.models import Max, F
from django.db.models.signals import pre_save
from django.dispatch import receiver

from ordered_model.models import OrderedModel

from comun import models as common_models

TIPOS_IMPORTANCIA = (
    ('PD', 'Por determinar'),
    ('V', 'Vital'),
    ('I', 'Importante'),
    ('B', 'Quedaría bien'),
)
TIPOS_URGENCIA = (
    ('PD', 'Por determinar'),
    ('I', 'Inmediatamente'),
    ('P', 'Hay presión'),
    ('E', 'Puede esperar'),
)
TIPOS_ESTADO_DESARROLLO = (
    ('PD', 'Por determinar'),
    ('C', 'En construcción'),
    ('PV', 'Pendiente de verificación'),
    ('PVA', 'Pendiente de validación'),
    ('VA', 'Validado'),
)
TIPOS_ESTABILIDAD = (
    ('PD', 'Por determinar'),
    ('B', 'Baja'),
    ('M', 'Media'),
    ('A', 'Alta'),
)
TIPOS_REQUISITO = (
    ('I', 'Información'),
    ('R', 'Restricción'),
    ('F', 'Funcional'),
    ('NF', 'No funcional'),
)
TIPOS_UNIDADES_TIEMPO = (
    ('PD', 'Por determinar'),
    ('A', 'Año(s)'),
    ('M', 'Mes(es)'),
    ('S', 'Semana(s)'),
    ('D', 'Día(s)'),
    ('H', 'Hora(s)'),
    ('MI', 'Minuto(s)'),
    ('SE', 'Segundo(s)'),
    ('DS', 'Décima(s) de segundo'),
    ('CS', 'Centésima(s) de segundo'),
    ('MS', 'Milisegundo(s)')
)
TIPOS_ACCIONES_CU = (
    ('S', 'Sistema'),
    ('M', 'Actor'),
    ('IE', 'Inclusión/Extensión'),
)
TIPOS_TERMINACION = (
    ('PD', 'Por determinar'),
    ('C', 'Continúa'),
    ('SE', 'Queda sin efecto'),
)
TIPOS_ESPECIALIZACION = (
    ('D', 'Subtipos disjuntos'),
    ('S', 'Subtipos solapados'),
)
TIPOS_COMPONENTE = (
    ('C', 'Conjunto'),
    ('SE', 'Secuencia'),
    ('B', 'Bolsa'),
    ('S', 'Simple'),
)
TIPOS_PROPIEDAD = (
    ('C', 'Constante'),
    ('V', 'Variable'),
    ('D', 'Derivada'),
)
TIPOS_EXPRESION = (
    ('PRE', 'Precondición'),
    ('POST', 'Postcondición'),
)
TIPOS_ESTADO_CONFLICTO = (
    ('PD', 'Por determinar'),
    ('NR', 'No resuelto'),
    ('PN', 'En proceso de negociación'),
    ('R', 'Resuelto'),
)
TIPOS_ESTADO_DEFECTO = (
    ('PD', 'Por determinar'),
    ('NE', 'No eliminado'),
    ('PN', 'En proceso de negociación'),
    ('E', 'Eliminado'),
)
TIPOS_ESTADO_PETICION_CAMBIO = (
    ('PD', 'Por determinar'),
    ('PA', 'Pendiente de análisis'),
    ('PAR', 'Pendiente de aprobar/rechazar'),
    ('PR', 'Pendiente de realización'),
    ('V', 'Verificado'),
    ('R', 'Rechazado'),
)
TIPOS_DEFECTO = (
    ('PD', 'Por determinar'),
    ('A', 'Ambigüedad'),
    ('NN', 'No necesidad'),
    ('IN', 'Incomprensibilidad'),
    ('NV', 'No verificabilidad'),
    ('IC', 'Inconsistencia'),
    ('NI', 'No implementabilidad'),
    ('VE', 'Verbosidad excesiva'),
    ('DD', 'Dependiente del diseño'),
    ('R', 'Redundancia'),
    ('IM', 'Imprecisión'),
    ('IP', 'Incompleción'),
    ('PNE', 'Prioridad no establecida'),
    ('ENE', 'Estabilidad no establecida'),
    ('NID', 'Nivel incorrecto de detalle'),
    ('NR', 'No rastreabilidad'),
    ('OI', 'Organizacion incorrecta'),
    ('O', 'Otro'),
)
TIPOS_TRAZABLES = (
    'parraforem', 'imagenrem', 'objetivorem', 'requisitorem', 'requisitoinformacionrem', 'casodeusorem',
    'tipoobjetorem', 'tipovalorrem', 'asociacionrem', 'operacionsistemarem', 'conflictorem', 'defectorem',
    'peticioncambiorem'
)


def calcula_numero_y_codigo(sender, instance, **kwargs):
    if not instance.pk:
        if sender == getattr(import_module('rem.models'), 'RequisitoREM'):
            prefijo = sender.PREFIJO_CODIGO[instance.tipo]
            aux = sender.objects.filter(
                documento__proyecto=instance.documento.proyecto, tipo=instance.tipo
            ).aggregate(Max('numero'))
        else:
            prefijo = sender.PREFIJO_CODIGO
            aux = sender.objects.filter(documento__proyecto=instance.documento.proyecto).aggregate(Max('numero'))
        instance.numero = aux['numero__max'] + 1 if aux['numero__max'] else 1
        instance.codigo = prefijo + '-' + str(format(instance.numero, '04d'))


class TipoBaseDefault(models.Model):
    codigo = models.CharField('codigo', max_length=50, blank=True, null=False)
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)

    def __str__(self):
        return '[{codigo}] {nombre}'.format(codigo=self.codigo, nombre=self.nombre)

    class Meta:
        db_table = 'wrem_tipobase'
        verbose_name = 'tipo base predefinido'
        verbose_name_plural = 'tipos base predefinidos'


class ObjetoREM(common_models.PolymorphicTimeStampedModel, OrderedModel):
    documento = models.ForeignKey(
        'rem.DocumentoREM', related_name='objetos', verbose_name='documento', blank=False,
        null=False, on_delete=models.CASCADE
    )
    numero = models.PositiveSmallIntegerField('numero', blank=True, null=False)
    codigo = models.CharField('codigo', max_length=50, blank=True, null=False)
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    version = models.CharField('version', max_length=10, blank=True, null=True, default='1.0')
    fecha_version = models.DateField(
        default=date.today, blank=True, null=True, verbose_name="fecha de versión",
    )
    autores = models.ManyToManyField('rem.ParticipanteREM', related_name='+', verbose_name='autores', blank=True)
    fuentes = models.ManyToManyField('rem.ParticipanteREM', related_name='+', verbose_name='fuentes', blank=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)
    trazabilidad_desde = models.ManyToManyField(
        'self', verbose_name='trazabilidad_desde', related_name='trazabilidad_hasta', symmetrical=False, blank=True
    )
    seccion = models.ForeignKey(
        'rem.SeccionREM', related_name='objetos', verbose_name='seccion', blank=True, null=True,
        on_delete=models.CASCADE
    )

    order_class_path = __module__ + '.ObjetoREM'
    order_with_respect_to = ('documento', 'seccion',)

    def change_seccion(self, *args, **kwargs):
        seccion = None
        if args[0]:
            seccion = ObjetoREM.objects.get(pk=args[0], documento=self.documento)

        qs = self.get_ordering_queryset()
        update_kwargs = {self.order_field_name: F(self.order_field_name) - 1}
        extra = kwargs.pop('extra_update', None)
        if extra:
            update_kwargs.update(extra)
        qs.filter(**{self.order_field_name + '__gt': getattr(self, self.order_field_name)})\
        .update(**update_kwargs)

        setattr(self, self.order_field_name, None)
        self.seccion = seccion
        self.save()
        return self

    def __str__(self):
        nombre = self.nombre if self.nombre else 'Sin nombre'
        return '[{codigo}] {nombre} ({documento})'.format(codigo=self.codigo, nombre=nombre, documento=self.documento)

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_objeto'
        verbose_name = 'objeto'
        verbose_name_plural = 'objetos'
        base_manager_name = 'base_objects'


class OrganizacionREM(ObjetoREM):
    PREFIJO_CODIGO = 'ORG'

    direccion = models.CharField('direccion', max_length=500, blank=True, null=True)
    telefono = models.CharField('telefono', max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        db_table = 'wrem_organizacion'
        verbose_name = 'organización'
        verbose_name_plural = 'organizaciones'


pre_save.connect(calcula_numero_y_codigo, sender=OrganizacionREM)


class ParticipanteREM(ObjetoREM):
    PREFIJO_CODIGO = 'STK'

    organizacion = models.ForeignKey(
        'rem.OrganizacionREM', verbose_name='organizacion', related_name='participantes_asociados', blank=True,
        null=True, on_delete=models.SET_NULL
    )
    rol = models.CharField('rol', max_length=200, blank=True, null=True)
    es_cliente = models.BooleanField('es cliente', default=False)
    es_desarrollador = models.BooleanField('es desarrollador', default=False)
    es_usuario = models.BooleanField('es usuario', default=False)

    class Meta:
        db_table = 'wrem_participante'
        verbose_name = 'participante'
        verbose_name_plural = 'participantes'


pre_save.connect(calcula_numero_y_codigo, sender=ParticipanteREM)


class ReunionREM(ObjetoREM):
    PREFIJO_CODIGO = 'MET'

    lugar = models.CharField('lugar', max_length=500, blank=True, null=True)
    fecha = models.DateTimeField(verbose_name='fecha', blank=True, null=True)
    asistentes = models.ManyToManyField('rem.ParticipanteREM', related_name='+', verbose_name='asistentes', blank=True)
    resultados = models.TextField('resultados', blank=True, null=True)

    class Meta:
        db_table = 'wrem_reunion'
        verbose_name = 'reunión'
        verbose_name_plural = 'reuniones'


pre_save.connect(calcula_numero_y_codigo, sender=ReunionREM)


class SeccionREM(ObjetoREM):
    PREFIJO_CODIGO = 'SEC'

    class Meta:
        db_table = 'wrem_seccion'
        verbose_name = 'sección'
        verbose_name_plural = 'secciones'


pre_save.connect(calcula_numero_y_codigo, sender=SeccionREM)


class ParrafoREM(ObjetoREM):
    PREFIJO_CODIGO = 'PRG'

    texto = models.TextField('texto', blank=True, null=True)

    class Meta:
        db_table = 'wrem_parrafo'
        verbose_name = 'párrafo'
        verbose_name_plural = 'párrafos'


pre_save.connect(calcula_numero_y_codigo, sender=ParrafoREM)


class ImagenREM(ObjetoREM):
    PREFIJO_CODIGO = 'GRF'

    imagen = models.ImageField(blank=False, upload_to='images/')

    class Meta:
        db_table = 'wrem_imagen'
        verbose_name = 'imagen'
        verbose_name_plural = 'imagenes'


pre_save.connect(calcula_numero_y_codigo, sender=ImagenREM)


class ObjetivoREM(ObjetoREM):
    PREFIJO_CODIGO = 'OBJ'

    padre = models.ForeignKey(
        'self', verbose_name='objetivo padre', related_name='subobjetivos', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    descripcion = models.TextField('texto', blank=True, null=True)
    importancia = models.CharField(
        'importancia', choices=TIPOS_IMPORTANCIA, max_length=2, default='PD', blank=False, null=True
    )
    urgencia = models.CharField('urgencia', choices=TIPOS_URGENCIA, max_length=2, default='PD', blank=False, null=True)
    estado_desarrollo = models.CharField(
        'estado de desarrollo', choices=TIPOS_ESTADO_DESARROLLO, max_length=3, default='PD', blank=False, null=True
    )
    estabilidad = models.CharField(
        'estabilidad', choices=TIPOS_ESTABILIDAD, max_length=2, default='PD', blank=False, null=True
    )

    class Meta:
        db_table = 'wrem_objetivo'
        verbose_name = 'objetivo'
        verbose_name_plural = 'objetivos'


pre_save.connect(calcula_numero_y_codigo, sender=ObjetivoREM)


class ActorREM(ObjetoREM):
    PREFIJO_CODIGO = 'ACT'

    descripcion = models.TextField('descripción', blank=True, null=True)

    class Meta:
        db_table = 'wrem_actor'
        verbose_name = 'actor'
        verbose_name_plural = 'actores'


pre_save.connect(calcula_numero_y_codigo, sender=ActorREM)


class RequisitoREM(ObjetoREM):
    PREFIJO_CODIGO = {'R': 'CRQ', 'F': 'FRQ', 'NF': 'NFR', 'I': 'IRQ'}

    tipo = models.CharField('tipo', choices=TIPOS_REQUISITO, max_length=2, blank=False, null=False)
    descripcion = models.TextField('descripción', blank=True, null=True)
    importancia = models.CharField(
        'importancia', choices=TIPOS_IMPORTANCIA, max_length=2, default='PD', blank=False, null=True
    )
    urgencia = models.CharField('urgencia', choices=TIPOS_URGENCIA, max_length=2, default='PD', blank=False, null=True)
    estado_desarrollo = models.CharField(
        'estado de desarrollo', choices=TIPOS_ESTADO_DESARROLLO, max_length=3, default='PD', blank=False, null=True
    )
    estabilidad = models.CharField(
        'estabilidad', choices=TIPOS_ESTABILIDAD, max_length=2, default='PD', blank=False, null=True
    )

    class Meta:
        db_table = 'wrem_requisito'
        verbose_name = 'requisito'
        verbose_name_plural = 'requisitos'


pre_save.connect(calcula_numero_y_codigo, sender=RequisitoREM)


class RequisitoInformacionREM(RequisitoREM):
    PREFIJO_CODIGO = 'IRQ'

    tiempo_vida_max = models.PositiveSmallIntegerField('tiempo de vida máximo', blank=True, null=True, default=None)
    tiempo_vida_max_ud = models.CharField(
        'unidad tiempo vida máximo', choices=TIPOS_UNIDADES_TIEMPO, max_length=2, default='PD', blank=False, null=True
    )
    tiempo_vida_med = models.PositiveSmallIntegerField('tiempo de vida medio', blank=True, null=True, default=None)
    tiempo_vida_med_ud = models.CharField(
        'unidad tiempo vida medio', choices=TIPOS_UNIDADES_TIEMPO, max_length=2, default='PD', blank=False, null=True
    )
    ocurrencias_simultaneas_max = models.PositiveSmallIntegerField(
        'ocurrencias simultáneas máximas', blank=True, null=True, default=None
    )
    ocurrencias_simultaneas_med = models.PositiveSmallIntegerField(
        'ocurrencias simultáneas medias', blank=True, null=True, default=None
    )

    class Meta:
        db_table = 'wrem_requisito_informacion'
        verbose_name = 'requisito de información'
        verbose_name_plural = 'requisitos de información'


@receiver([pre_save], sender=RequisitoInformacionREM)
def tipo_informacion(sender, instance, **kwargs):
    if not instance.pk:
        instance.tipo = 'I'

pre_save.connect(calcula_numero_y_codigo, sender=RequisitoInformacionREM)


class DatoEspecificoREM(common_models.TimeStampedModel, OrderedModel):
    requisito_informacion = models.ForeignKey(
        'rem.RequisitoInformacionREM', verbose_name='requisito de información', related_name='datos_especificos',
        blank=False, null=False, on_delete=models.CASCADE
    )
    descripcion = models.TextField('descripción', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)
    order_with_respect_to = 'requisito_informacion'

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_datoespecifico'
        verbose_name = 'dato específico'
        verbose_name_plural = 'datos específicos'


class CasoDeUsoREM(ObjetoREM):
    PREFIJO_CODIGO = 'UC'

    es_abstracto = models.BooleanField('es abstracto', default=False)
    evento_activacion = models.TextField('evento de activación', blank=True, null=True)
    frecuencia = models.PositiveSmallIntegerField('frecuencia', blank=True, null=True, default=None)
    frecuencia_ud = models.CharField(
        'unidad frecuencia', choices=TIPOS_UNIDADES_TIEMPO, max_length=2, default='PD', blank=False, null=True
    )
    precondicion = models.TextField('precondición', blank=True, null=True)
    postcondicion = models.TextField('postcondición', blank=True, null=True)
    importancia = models.CharField(
        'importancia', choices=TIPOS_IMPORTANCIA, max_length=2, default='PD', blank=False, null=True
    )
    urgencia = models.CharField('urgencia', choices=TIPOS_URGENCIA, max_length=2, default='PD', blank=False, null=True)
    estado_desarrollo = models.CharField(
        'estado de desarrollo', choices=TIPOS_ESTADO_DESARROLLO, max_length=3, default='PD', blank=False, null=True
    )
    estabilidad = models.CharField(
        'estabilidad', choices=TIPOS_ESTABILIDAD, max_length=2, default='PD', blank=False, null=True
    )

    class Meta:
        db_table = 'wrem_casouso'
        verbose_name = 'caso de uso'
        verbose_name_plural = 'casos de uso'


pre_save.connect(calcula_numero_y_codigo, sender=CasoDeUsoREM)


class PasoCUREM(common_models.TimeStampedModel, OrderedModel):
    caso_uso = models.ForeignKey(
        'rem.CasoDeUsoREM', verbose_name='caso de uso', related_name='pasos', blank=False, null=False,
        on_delete=models.CASCADE
    )
    es_condicional = models.BooleanField('es condicional', default=False)
    condicion = models.TextField('condición', blank=True, null=True)
    tipo_accion = models.CharField(
        'tipo de acción', choices=TIPOS_ACCIONES_CU, max_length=2, default='S', blank=False, null=True
    )
    actor = models.ForeignKey(
        'rem.ActorREM', verbose_name='actor', related_name='+', blank=True, null=True, on_delete=models.SET_NULL
    )
    inclusion_extension = models.ForeignKey(
        'rem.CasoDeUsoREM', verbose_name='inclusión/extensión', related_name='+', blank=True, null=True, on_delete=models.SET_NULL
    )
    acciones_realizadas = models.TextField('acciones realizadas', blank=True, null=True)
    rendimiento = models.PositiveSmallIntegerField('rendimiento', blank=True, null=True, default=None)
    rendimiento_ud = models.CharField(
        'unidad rendimiento', choices=TIPOS_UNIDADES_TIEMPO, max_length=2, default='PD', blank=False, null=True
    )
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = 'caso_uso'

    def __str__(self):
        return '{numero} [{caso}]'.format(numero=self.order, caso=self.caso_uso)

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_paso_cu'
        verbose_name = 'paso (caso de uso)'
        verbose_name_plural = 'pasos (caso de uso)'


class ExcepcionPasoCUREM(common_models.TimeStampedModel, OrderedModel):
    paso = models.ForeignKey(
        'rem.PasoCUREM', verbose_name='paso de caso de uso', related_name='excepciones', blank=False, null=False,
        on_delete=models.CASCADE
    )
    condicion = models.TextField('condición', blank=True, null=True)
    terminacion = models.CharField(
        'terminación de la excepción', choices=TIPOS_TERMINACION, max_length=2, default='PD', blank=False, null=True
    )
    tipo_accion = models.CharField(
        'tipo de acción', choices=TIPOS_ACCIONES_CU, max_length=2, default='S', blank=False, null=True
    )
    actor = models.ForeignKey(
        'rem.ActorREM', verbose_name='actor', related_name='+', blank=True, null=True, on_delete=models.SET_NULL
    )
    inclusion_extension = models.ForeignKey(
        'rem.CasoDeUsoREM', verbose_name='inclusión/extensión', related_name='+', blank=True, null=True, on_delete=models.SET_NULL
    )
    acciones_realizadas = models.TextField('acciones realizadas', blank=True, null=True)
    rendimiento = models.PositiveSmallIntegerField('rendimiento', blank=True, null=True, default=None)
    rendimiento_ud = models.CharField(
        'unidad rendimiento', choices=TIPOS_UNIDADES_TIEMPO, max_length=2, default='PD', blank=False, null=True
    )
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = 'paso'

    def __str__(self):
        return str(self.order)

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_excepcion_paso_cu'
        verbose_name = 'excepción (paso de caso de uso)'
        verbose_name_plural = 'excepciones (pasos de caso de uso)'


class MatrizTrazabilidadREM(ObjetoREM):
    PREFIJO_CODIGO = 'TRM'

    tipo_filas = models.ForeignKey(
        ContentType, null=True, blank=False, on_delete=models.SET_NULL, related_name='+',
        limit_choices_to={'app_label': 'rem', 'model__in': TIPOS_TRAZABLES}
    )
    subtipo_filas = models.CharField('subtipo de filas (requisitos)', choices=TIPOS_REQUISITO, max_length=2, blank=True, null=True)
    tipo_columnas = models.ForeignKey(
        ContentType, null=True, blank=False, on_delete=models.SET_NULL, related_name='+',
        limit_choices_to={'app_label': 'rem', 'model__in': TIPOS_TRAZABLES}
    )
    subtipo_columnas = models.CharField('subtipo de columnas (requisitos)', choices=TIPOS_REQUISITO, max_length=2, blank=True, null=True)

    class Meta:
        db_table = 'wrem_matriztrazabilidad'
        verbose_name = 'matriz de trazabilidad'
        verbose_name_plural = 'matrices de trazabilidad'


pre_save.connect(calcula_numero_y_codigo, sender=MatrizTrazabilidadREM)


class TipoObjetoREM(ObjetoREM):
    PREFIJO_CODIGO = 'TYP'

    es_abstracto = models.BooleanField('es abstracto', default=False)
    supertipo = models.ForeignKey(
        'self', verbose_name='supertipo', related_name='subtipos', blank=True, null=True, on_delete=models.SET_NULL
    )
    subtipo = models.CharField('especialización', choices=TIPOS_ESPECIALIZACION, default='D', max_length=1, blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)

    class Meta:
        db_table = 'wrem_tipoobjeto'
        verbose_name = 'tipo de objeto'
        verbose_name_plural = 'tipos de objeto'


pre_save.connect(calcula_numero_y_codigo, sender=TipoObjetoREM)


class ComponenteREM(common_models.TimeStampedModel, OrderedModel):
    tipo_objeto = models.ForeignKey(
        'rem.TipoObjetoREM', verbose_name='tipo de objeto', related_name='componentes', blank=False, null=False,
        on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    tipo_base = models.ForeignKey(
        'rem.ObjetoREM', verbose_name='tipo base', related_name='+', blank=True, null=True, on_delete=models.SET_NULL,
        limit_choices_to={'polymorphic_ctype__model__in': ['tipoobjetorem', 'asociacionrem']}
    )
    tipo = models.CharField(
        'tipo de componente', choices=TIPOS_COMPONENTE, max_length=2, default='S', blank=False, null=True
    )
    multiplicidad_inferior = models.CharField('multiplicidad inferior', max_length=100, blank=True, null=True)
    multiplicidad_superior = models.CharField('multiplicidad superior', max_length=100, blank=True, null=True)
    tipo_propiedad = models.CharField(
        'tipo de propiedad', choices=TIPOS_PROPIEDAD, max_length=1, default='V', blank=False, null=True
    )
    valor = models.TextField('valor inicial/expresión de derivacion', blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = 'tipo_objeto'

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_componente'
        verbose_name = 'componente (tipo de objeto)'
        verbose_name_plural = 'componentes (tipo de objeto)'


class TipoValorREM(ObjetoREM):
    PREFIJO_CODIGO = 'VAL'

    definicion = models.TextField('definición', blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)

    class Meta:
        db_table = 'wrem_tipovalor'
        verbose_name = 'tipo de valor'
        verbose_name_plural = 'tipos de valor'


pre_save.connect(calcula_numero_y_codigo, sender=TipoValorREM)


class AtributoREM(common_models.TimeStampedModel, OrderedModel):
    tipo_objeto = models.ForeignKey(
        'rem.TipoObjetoREM', verbose_name='tipo de objeto', related_name='atributos', blank=True, null=True,
        on_delete=models.CASCADE
    )
    tipo_valor = models.ForeignKey(
        'rem.TipoValorREM', verbose_name='tipo de valor', related_name='atributos', blank=True, null=True,
        on_delete=models.CASCADE)
    asociacion = models.ForeignKey(
        'rem.AsociacionREM', verbose_name='asociacion', related_name='atributos', blank=True, null=True,
        on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    tipo_base_default = models.ForeignKey(
        'rem.TipoBaseDefault', verbose_name='tipo base default', related_name='+', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    tipo_base = models.ForeignKey(
        'rem.TipoValorREM', verbose_name='tipo base', related_name='+', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    tipo = models.CharField(
        'tipo de atributo', choices=TIPOS_COMPONENTE, max_length=2, default='S', blank=False, null=True
    )
    multiplicidad_inferior = models.CharField('multiplicidad inferior', max_length=100, blank=True, null=True)
    multiplicidad_superior = models.CharField('multiplicidad superior', max_length=100, blank=True, null=True)
    tipo_propiedad = models.CharField(
        'tipo de propiedad', choices=TIPOS_PROPIEDAD, max_length=1, default='V', blank=False, null=True
    )
    valor = models.TextField('valor inicial/expresión de derivacion', blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = ('tipo_objeto', 'tipo_valor', 'asociacion',)

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_atributo'
        verbose_name = 'atributo (tipo de objeto / tipo de valor / asociacion)'
        verbose_name_plural = 'atributos (tipo de objeto / tipo de valor / asociacion)'


class ExpresionREM(common_models.TimeStampedModel, OrderedModel):
    tipo_objeto = models.ForeignKey(
        'rem.TipoObjetoREM', verbose_name='tipo de objeto', related_name='expresiones', blank=True,
        null=True, on_delete=models.CASCADE
    )
    tipo_valor = models.ForeignKey(
        'rem.TipoValorREM', verbose_name='tipo de valor', related_name='expresiones', blank=True, null=True,
        on_delete=models.CASCADE
    )
    asociacion = models.ForeignKey(
        'rem.AsociacionREM', verbose_name='asociacion', related_name='expresiones', blank=True, null=True,
        on_delete=models.CASCADE
    )
    operacion_sistema = models.ForeignKey(
        'rem.OperacionSistemaREM', verbose_name='operacion de sistema', related_name='expresiones', blank=True,
        null=True, on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    tipo = models.CharField(
        'tipo de expresion', choices=TIPOS_EXPRESION, max_length=4, default=None, blank=True, null=True
    )
    expresion_lenguaje_natural = models.TextField('expresion lenguaje natural', blank=True, null=True)
    expresion_ocl = models.TextField('expresion OCL', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = ('tipo_objeto', 'tipo_valor', 'asociacion', 'operacion_sistema',)

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_expresion'
        verbose_name = 'expresion (tipo de objeto / tipo de valor / asociacion / operacion de sistema)'
        verbose_name_plural = 'expresiones (tipo de objeto / tipo de valor / asociacion / operacion de sistema)'


class AsociacionREM(ObjetoREM):
    PREFIJO_CODIGO = 'ASO'

    es_derivada = models.BooleanField('es derivada', default=False)
    descripcion = models.TextField('descripción', blank=True, null=True)

    class Meta:
        db_table = 'wrem_asociacion'
        verbose_name = 'asociación'
        verbose_name_plural = 'asociaciones'


pre_save.connect(calcula_numero_y_codigo, sender=AsociacionREM)


class RolREM(common_models.TimeStampedModel, OrderedModel):
    asociacion = models.ForeignKey(
        'rem.AsociacionREM', verbose_name='asociación', related_name='roles', blank=False, null=False,
        on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    tipo_base = models.ForeignKey(
        'rem.TipoObjetoREM', verbose_name='tipo base', related_name='+', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    tipo = models.CharField(
        'tipo de componente', choices=TIPOS_COMPONENTE, max_length=2, default='S', blank=False, null=True
    )
    multiplicidad_inferior = models.CharField('multiplicidad inferior', max_length=100, blank=True, null=True)
    multiplicidad_superior = models.CharField('multiplicidad superior', max_length=100, blank=True, null=True)
    tipo_propiedad = models.CharField(
        'tipo de propiedad', choices=TIPOS_PROPIEDAD, max_length=1, default='V', blank=False, null=True
    )
    valor = models.TextField('valor inicial/expresión de derivacion', blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = 'asociacion'

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_rol'
        verbose_name = 'rol (asociacion)'
        verbose_name_plural = 'roles (asociacion)'


class OperacionSistemaREM(ObjetoREM):
    PREFIJO_CODIGO = 'SOP'

    tipo_resultado = models.TextField('tipo de resultado', blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)

    class Meta:
        db_table = 'wrem_operacionsistema'
        verbose_name = 'operación de sistema'
        verbose_name_plural = 'operaciones de sistema'


pre_save.connect(calcula_numero_y_codigo, sender=OperacionSistemaREM)


class ExcepcionOSREM(common_models.TimeStampedModel, OrderedModel):
    operacion_sistema = models.ForeignKey(
        'rem.OperacionSistemaREM', verbose_name='operación de sistema', related_name='excepciones', blank=False,
        null=False, on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    condicion_lenguaje_natural = models.TextField('condición lenguaje natural', blank=True, null=True)
    condicion_ocl = models.TextField('condición OCL', blank=True, null=True)
    expresion_lenguaje_natural = models.TextField('expresión lenguaje natural', blank=True, null=True)
    expresion_ocl = models.TextField('expresión OCL', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = 'operacion_sistema'

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_excepcion_os'
        verbose_name = 'excepción (operacion de sistema)'
        verbose_name_plural = 'excepciones (operacion de sistema)'


class ParametroREM(common_models.TimeStampedModel, OrderedModel):
    operacion_sistema = models.ForeignKey(
        'rem.OperacionSistemaREM', verbose_name='operación de sistema', related_name='parametros', blank=False,
        null=False, on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    tipo_base_default = models.ForeignKey(
        'rem.TipoBaseDefault', verbose_name='tipo base default', related_name='+', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    tipo_base = models.ForeignKey(
        'rem.ObjetoREM', verbose_name='tipo base', related_name='+', blank=True, null=True, on_delete=models.SET_NULL,
        limit_choices_to={'polymorphic_ctype__model__in': ['tipoobjetorem', 'tipovalorrem', 'asociacionrem']}
    )
    tipo = models.CharField(
        'tipo de atributo', choices=TIPOS_COMPONENTE, max_length=2, default='S', blank=False, null=True
    )
    multiplicidad_inferior = models.CharField('multiplicidad inferior', max_length=100, blank=True, null=True)
    multiplicidad_superior = models.CharField('multiplicidad superior', max_length=100, blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = 'operacion_sistema'

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_parametro'
        verbose_name = 'parametro (operacion de sistema)'
        verbose_name_plural = 'parametros (operacion de sistema)'


class ConflictoREM(ObjetoREM):
    PREFIJO_CODIGO = 'CLF'

    descripcion = models.TextField('descripción', blank=True, null=True)
    solucion = models.TextField('solución', blank=True, null=True)
    importancia = models.CharField(
        'importancia', choices=TIPOS_IMPORTANCIA, max_length=2, default='PD', blank=False, null=True
    )
    urgencia = models.CharField('urgencia', choices=TIPOS_URGENCIA, max_length=2, default='PD', blank=False, null=True)
    estado = models.CharField('estado', choices=TIPOS_ESTADO_CONFLICTO, max_length=2, default='PD', blank=False, null=True)

    class Meta:
        db_table = 'wrem_conflicto'
        verbose_name = 'conflicto'
        verbose_name_plural = 'conflictos'


pre_save.connect(calcula_numero_y_codigo, sender=ConflictoREM)


class AlternativaREM(common_models.TimeStampedModel, OrderedModel):
    conflicto = models.ForeignKey(
        'rem.ConflictoREM', verbose_name='conflicto', related_name='alternativas', blank=True, null=True,
        on_delete=models.CASCADE
    )
    defecto = models.ForeignKey(
        'rem.DefectoREM', verbose_name='defecto', related_name='alternativas', blank=True, null=True,
        on_delete=models.CASCADE
    )
    nombre = models.CharField('nombre', max_length=500, blank=True, null=True)
    autores = models.ManyToManyField('rem.ParticipanteREM', related_name='+', verbose_name='autores', blank=True)
    descripcion = models.TextField('descripción', blank=True, null=True)
    comentarios = models.TextField('comentarios', blank=True, null=True)

    order_with_respect_to = ('conflicto', 'defecto',)

    def __str__(self):
        return self.nombre

    class Meta(OrderedModel.Meta):
        db_table = 'wrem_alternativa'
        verbose_name = 'alternativa (conflicto / defecto)'
        verbose_name_plural = 'alternativas (conflicto / defecto)'


class DefectoREM(ObjetoREM):
    PREFIJO_CODIGO = 'DEF'

    tipo = models.CharField('tipo', choices=TIPOS_DEFECTO, max_length=3, blank=False, null=False)
    descripcion = models.TextField('descripción', blank=True, null=True)
    solucion = models.TextField('solución', blank=True, null=True)
    importancia = models.CharField(
        'importancia', choices=TIPOS_IMPORTANCIA, max_length=2, default='PD', blank=False, null=True
    )
    urgencia = models.CharField('urgencia', choices=TIPOS_URGENCIA, max_length=2, default='PD', blank=False, null=True)
    estado = models.CharField('estado', choices=TIPOS_ESTADO_DEFECTO, max_length=2, default='PD', blank=False, null=True)

    class Meta:
        db_table = 'wrem_defecto'
        verbose_name = 'defecto'
        verbose_name_plural = 'defectos'


pre_save.connect(calcula_numero_y_codigo, sender=DefectoREM)


class PeticionCambioREM(ObjetoREM):
    PREFIJO_CODIGO = 'CHR'

    descripcion = models.TextField('descripción', blank=True, null=True)
    analisis = models.TextField('análisis', blank=True, null=True)
    importancia = models.CharField(
        'importancia', choices=TIPOS_IMPORTANCIA, max_length=2, default='PD', blank=False, null=True
    )
    urgencia = models.CharField('urgencia', choices=TIPOS_URGENCIA, max_length=2, default='PD', blank=False, null=True)
    estado = models.CharField('estado', choices=TIPOS_ESTADO_PETICION_CAMBIO, max_length=3, default='PD', blank=False, null=True)

    class Meta:
        db_table = 'wrem_peticioncambio'
        verbose_name = 'petición de cambio'
        verbose_name_plural = 'peticiones de cambio'


pre_save.connect(calcula_numero_y_codigo, sender=PeticionCambioREM)
