"""wrem URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_jwt import views as jwt_views

from rem import views

urlpatterns = [
    # Angular 2 Client App
    url(r'^$', views.index, name='index'),

    # Django Auth
    url(r'^password_reset/$', auth_views.password_reset, {
        'template_name': 'usuarios/password_reset_form.html',
        'email_template_name': 'usuarios/password_reset_email.html',
    }, name='password_reset'),
    url(r'^password_reset/done/$', auth_views.password_reset_done, {
        'template_name': 'usuarios/password_reset_done.html',
    }, name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', auth_views.password_reset_confirm, {
        'template_name': 'usuarios/password_reset_confirm.html',
    }, name='password_reset_confirm'),
    url(r'^reset/done/$', auth_views.password_reset_complete, {
        'template_name': 'usuarios/password_reset_complete.html',
    }, name='password_reset_complete'),

    # Django Admin
    # url(r'^admin/', admin.site.urls),
    url(r'^admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    url(r'^secret/', include(admin.site.urls)),

    # Rest Framework API Auth
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Rest Framework JWT Auth
    url(r'^api-token-auth/', jwt_views.obtain_jwt_token),
    url(r'^api-token-refresh/', jwt_views.refresh_jwt_token),
    url(r'^api-token-verify/', jwt_views.verify_jwt_token),

    # Views de Usuarios
    url(r'^usuarios/', include('usuarios.urls', namespace='usuarios')),

    # Views de API
    url(r'^api/', include('rem.api_urls')),
    url(r'^api/', include('usuarios.api_urls')),
] + static(
    settings.STATIC_URL, document_root=settings.STATIC_ROOT
) + static(
    settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

urlpatterns += [
    # catch-all pattern for compatibility with the Angular routes. This must be last in the list.
    url(r'^(?P<path>.*)/$', views.index)
]
