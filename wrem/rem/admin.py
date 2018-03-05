from django.contrib import admin

from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin, PolymorphicChildModelFilter
from ordered_model.admin import OrderedTabularInline

from comun.filters import DropdownRelatedFieldFilter
from rem.models import (
    ProyectoREM, DocumentoREM, LogREM, ObjetoREM,
    OrganizacionREM, ParticipanteREM, ReunionREM, SeccionREM, ParrafoREM, ImagenREM,
    ObjetivoREM, ActorREM, RequisitoREM, RequisitoInformacionREM, CasoDeUsoREM,
    ExcepcionPasoCUREM, PasoCUREM, TipoObjetoREM, ComponenteREM, TipoValorREM,
    AtributoREM, ExpresionREM, AsociacionREM, RolREM, OperacionSistemaREM, ExcepcionOSREM,
    ConflictoREM, AlternativaREM, DefectoREM, PeticionCambioREM, TipoBaseDefault, ParametroREM, DatoEspecificoREM,
    MatrizTrazabilidadREM
)


class LogInlineForProyectoAdmin(admin.StackedInline):
    model = LogREM
    extra = 1
    exclude = ('documento', 'objeto',)


@admin.register(ProyectoREM)
class ProyectoREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'autor', 'fecha_ultima_apertura', 'usuario_ultima_apertura',)
    search_fields = ('id', 'nombre',)
    filter_horizontal = ('grupos',)
    readonly_fields = ('creado', 'modificado', 'fecha_ultima_apertura', 'usuario_ultima_apertura',)
    list_filter = (
        ('autor', DropdownRelatedFieldFilter),
        ('grupos', DropdownRelatedFieldFilter),
    )
    inlines = (LogInlineForProyectoAdmin,)


class LogInlineForDocumentoAdmin(admin.StackedInline):
    model = LogREM
    extra = 1
    exclude = ('proyecto', 'objeto',)


@admin.register(DocumentoREM)
class DocumentoREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'proyecto', 'autor',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')
    list_filter = (
        ('proyecto', DropdownRelatedFieldFilter),
        ('autor', DropdownRelatedFieldFilter),
    )
    inlines = (LogInlineForDocumentoAdmin,)


@admin.register(TipoBaseDefault)
class TipoBaseDefaultAdmin(admin.ModelAdmin):
    list_display = ('id', 'codigo', 'nombre',)
    search_fields = ('id', 'codigo', 'nombre',)


class LogInlineForObjetoAdmin(admin.StackedInline):
    model = LogREM
    extra = 1
    exclude = ('proyecto', 'documento',)


class ObjetoREMChildAdmin(PolymorphicChildModelAdmin):
    """ Base admin class for all child models """
    base_model = ObjetoREM
    list_display = ('id', 'nombre', 'documento', 'get_proyecto',)
    search_fields = ('id', 'codigo', 'nombre',)
    filter_horizontal = ('autores', 'fuentes', 'trazabilidad_desde',)
    list_filter = (
        ('documento__proyecto', DropdownRelatedFieldFilter),
        ('documento', DropdownRelatedFieldFilter),
    )
    readonly_fields = ('numero', 'codigo', 'creado', 'modificado')
    inlines = (LogInlineForObjetoAdmin,)

    def get_proyecto(self, obj):
        return obj.documento.proyecto
    get_proyecto.short_description = 'proyecto'
    get_proyecto.admin_order_field = 'documento__proyecto'


@admin.register(OrganizacionREM)
class OrganizacionREMAdmin(ObjetoREMChildAdmin):
    base_model = OrganizacionREM
    show_in_index = True


@admin.register(ParticipanteREM)
class ParticipanteREMAdmin(ObjetoREMChildAdmin):
    base_model = ParticipanteREM
    show_in_index = True


@admin.register(ReunionREM)
class ReunionREMAdmin(ObjetoREMChildAdmin):
    base_model = ReunionREM
    show_in_index = True

    filter_horizontal = ObjetoREMChildAdmin.filter_horizontal + ('asistentes',)


class SeccionObjetosInline(OrderedTabularInline):
    model = ObjetoREM
    fields = ('codigo', 'nombre', 'order', 'move_up_down_links',)
    readonly_fields = ('codigo', 'nombre', 'order', 'move_up_down_links',)
    extra = 1
    ordering = ('order',)


@admin.register(SeccionREM)
class SeccionREMAdmin(ObjetoREMChildAdmin):
    base_model = SeccionREM
    show_in_index = True

    inlines = (SeccionObjetosInline,)

    def get_urls(self):
        urls = super(SeccionREMAdmin, self).get_urls()
        for inline in self.inlines:
            if hasattr(inline, 'get_urls'):
                urls = inline.get_urls(self) + urls
        return urls


@admin.register(ParrafoREM)
class ParrafoREMAdmin(ObjetoREMChildAdmin):
    base_model = ParrafoREM
    show_in_index = True


@admin.register(ImagenREM)
class ImagenREMAdmin(ObjetoREMChildAdmin):
    base_model = ImagenREM
    show_in_index = True


@admin.register(ObjetivoREM)
class ObjetivoREMAdmin(ObjetoREMChildAdmin):
    base_model = ObjetivoREM
    show_in_index = True


@admin.register(ActorREM)
class ActorREMAdmin(ObjetoREMChildAdmin):
    base_model = ActorREM
    show_in_index = True


@admin.register(RequisitoREM)
class RequisitoREMAdmin(ObjetoREMChildAdmin):
    base_model = RequisitoREM
    show_in_index = True


@admin.register(RequisitoInformacionREM)
class RequisitoInformacionREMAdmin(ObjetoREMChildAdmin):
    base_model = RequisitoInformacionREM
    show_in_index = True

    exclude = ('tipo',)


@admin.register(DatoEspecificoREM)
class DatoEspecificoREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'requisito_informacion', 'get_documento',)
    search_fields = ('id',)
    readonly_fields = ('creado', 'modificado')
    list_filter = (
        ('requisito_informacion', DropdownRelatedFieldFilter),
    )

    def get_documento(self, obj):
        return obj.requisito_informacion.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'requisito_informacion__documento'


@admin.register(CasoDeUsoREM)
class CasoDeUsoREMAdmin(ObjetoREMChildAdmin):
    base_model = CasoDeUsoREM
    show_in_index = True


@admin.register(PasoCUREM)
class PasoCUREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'caso_uso', 'get_documento',)
    search_fields = ('id',)
    readonly_fields = ('creado', 'modificado')
    list_filter = (
        ('caso_uso', DropdownRelatedFieldFilter),
    )

    def get_documento(self, obj):
        return obj.caso_uso.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'caso_uso__documento'


@admin.register(ExcepcionPasoCUREM)
class ExcepcionPasoCUREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'paso', 'get_caso_uso', 'get_documento',)
    search_fields = ('id',)
    readonly_fields = ('creado', 'modificado')

    def get_caso_uso(self, obj):
        return obj.paso.caso_uso
    get_caso_uso.short_description = 'caso de uso'
    get_caso_uso.admin_order_field = 'paso__caso_uso'

    def get_documento(self, obj):
        return obj.paso.caso_uso.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'paso__caso_uso__documento'


@admin.register(MatrizTrazabilidadREM)
class MatrizTrazabilidadREMAdmin(ObjetoREMChildAdmin):
    base_model = MatrizTrazabilidadREM
    show_in_index = True


@admin.register(TipoObjetoREM)
class TipoObjetoREMAdmin(ObjetoREMChildAdmin):
    base_model = TipoObjetoREM
    show_in_index = True


@admin.register(ComponenteREM)
class ComponenteREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'tipo_objeto', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')

    def get_documento(self, obj):
        return obj.tipo_objeto.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'tipo_objeto__documento'


@admin.register(TipoValorREM)
class TipoValorREMAdmin(ObjetoREMChildAdmin):
    base_model = TipoValorREM
    show_in_index = True


@admin.register(AtributoREM)
class AtributoREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'tipo_objeto', 'tipo_valor', 'asociacion', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')

    def get_documento(self, obj):
        if obj.tipo_objeto:
            return obj.tipo_objeto.documento
        elif obj.tipo_valor:
            return obj.tipo_valor.documento
        elif obj.asociacion:
            return obj.asociacion.documento
        else:
            return None
    get_documento.short_description = 'documento'


@admin.register(ExpresionREM)
class ExpresionREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'tipo_objeto', 'tipo_valor', 'asociacion', 'operacion_sistema', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')

    def get_documento(self, obj):
        if obj.tipo_objeto:
            return obj.tipo_objeto.documento
        elif obj.tipo_valor:
            return obj.tipo_valor.documento
        elif obj.asociacion:
            return obj.asociacion.documento
        elif obj.operacion_sistema:
            return obj.operacion_sistema.documento
        else:
            return None
    get_documento.short_description = 'documento'


@admin.register(AsociacionREM)
class AsociacionREMAdmin(ObjetoREMChildAdmin):
    base_model = AsociacionREM
    show_in_index = True


@admin.register(RolREM)
class RolREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'asociacion', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')

    def get_documento(self, obj):
        return obj.asociacion.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'asociacion__documento'


@admin.register(OperacionSistemaREM)
class OperacionSistemaREMAdmin(ObjetoREMChildAdmin):
    base_model = OperacionSistemaREM
    show_in_index = True


@admin.register(ParametroREM)
class ParametroREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'operacion_sistema', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')

    def get_documento(self, obj):
        return obj.operacion_sistema.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'operacion_sistema__documento'


@admin.register(ExcepcionOSREM)
class ExcepcionOSREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'operacion_sistema', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')

    def get_documento(self, obj):
        return obj.operacion_sistema.documento
    get_documento.short_description = 'documento'
    get_documento.admin_order_field = 'operacion_sistema__documento'


@admin.register(ConflictoREM)
class ConflictoREMAdmin(ObjetoREMChildAdmin):
    base_model = ConflictoREM
    show_in_index = True

    filter_horizontal = ObjetoREMChildAdmin.filter_horizontal


@admin.register(AlternativaREM)
class AlternativaREMAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'conflicto', 'defecto', 'get_documento',)
    search_fields = ('id', 'nombre',)
    readonly_fields = ('creado', 'modificado')
    filter_horizontal = ('autores',)

    def get_documento(self, obj):
        if obj.conflicto:
            return obj.conflicto.documento
        elif obj.defecto:
            return obj.defecto.documento
        else:
            return None
    get_documento.short_description = 'documento'


@admin.register(DefectoREM)
class DefectoREMAdmin(ObjetoREMChildAdmin):
    base_model = DefectoREM
    show_in_index = True

    filter_horizontal = ObjetoREMChildAdmin.filter_horizontal


@admin.register(PeticionCambioREM)
class PeticionCambioREMAdmin(ObjetoREMChildAdmin):
    base_model = PeticionCambioREM
    show_in_index = True

    filter_horizontal = ObjetoREMChildAdmin.filter_horizontal


@admin.register(ObjetoREM)
class ObjetoREMParentAdmin(PolymorphicParentModelAdmin):
    """ The parent model admin """
    base_model = ObjetoREM
    child_models = (
        OrganizacionREM, ParticipanteREM, ReunionREM, SeccionREM, ParrafoREM, ImagenREM,
        ObjetivoREM, ActorREM, RequisitoREM, RequisitoInformacionREM, CasoDeUsoREM,
        TipoObjetoREM, TipoValorREM, AsociacionREM, OperacionSistemaREM, ConflictoREM,
        DefectoREM, PeticionCambioREM, MatrizTrazabilidadREM
    )
    list_display = ('id', 'codigo', 'nombre', 'documento', 'get_proyecto',)
    search_fields = ('id', 'codigo', 'nombre',)
    list_filter = (
        PolymorphicChildModelFilter,
        ('documento__proyecto', DropdownRelatedFieldFilter),
        ('documento', DropdownRelatedFieldFilter)
    )

    def get_proyecto(self, obj):
        return obj.documento.proyecto
    get_proyecto.short_description = 'proyecto'
    get_proyecto.admin_order_field = 'documento__proyecto'
