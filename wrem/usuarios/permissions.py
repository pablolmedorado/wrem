from rest_framework import permissions


class UsuarioPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        else:
            return request.user.is_authenticated()

    def has_object_permission(self, request, view, obj):
        return request.user and (request.user.is_staff or obj == request.user)


class GrupoPermission(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_admin_of_group(obj):
            return True
        else:
            return (
                request.method in permissions.SAFE_METHODS and
                request.user.belongs_to_group(obj)
            )
