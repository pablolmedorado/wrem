from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render


@ensure_csrf_cookie
def index(request, path=''):
    """
    Renders the Angular2 SPA
    """
    return render(request, 'rem/index.html')
