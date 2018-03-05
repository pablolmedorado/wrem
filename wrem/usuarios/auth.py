from usuarios.serializers import UsuarioSerializer


def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'usuario': UsuarioSerializer(user, fields=['id', 'email', 'full_name'], context={'request': request}).data
    }
