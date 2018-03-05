from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404, redirect

from usuarios.models import Usuario


def validar_email(request, uidb64, token):
    usuario = get_object_or_404(Usuario, id=urlsafe_base64_decode(uidb64).decode())
    usuario.confirm_email(token)
    usuario.is_active = True
    usuario.save()
    return redirect('/login?activated=true')
