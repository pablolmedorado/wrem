from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext as _

from comun.filters import DropdownRelatedFieldFilter
from usuarios.models import Usuario, Grupo


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = UserAdmin.list_filter + (
        ('grupos', DropdownRelatedFieldFilter),
    )
    search_fields = ('first_name', 'last_name', 'email')
    ordering = ('email',)


@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'administrador',)
    search_fields = ('id', 'nombre',)
    filter_horizontal = ('usuarios',)
    readonly_fields = ('creado', 'modificado',)
    list_filter = (
        ('administrador', DropdownRelatedFieldFilter),
    )
