from rest_framework import permissions


class ProyectoPermission(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.method not in permissions.SAFE_METHODS and not obj.can_be_modified_by(request.user):
            return False
        if request.user.is_staff or obj.autor == request.user:
            return True
        else:
            return (
                request.user.grupos.filter(proyectos__pk=obj.pk).exists()
            )


class DocumentoPermission(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.method not in permissions.SAFE_METHODS and not obj.proyecto.can_be_modified_by(request.user):
            return False
        if request.user.is_staff or obj.autor == request.user:
            return True
        else:
            return (
                request.user.grupos.filter(proyectos__pk=obj.proyecto.pk).exists()
            )


class ObjetoPermission(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.method not in permissions.SAFE_METHODS and not obj.documento.proyecto.can_be_modified_by(request.user):
            return False
        if request.user.is_staff or obj.documento.autor == request.user:
            return True
        else:
            return (
                request.user.grupos.filter(proyectos__pk=obj.documento.proyecto.pk).exists()
            )
