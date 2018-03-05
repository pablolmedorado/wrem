from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.conf import settings
from django.contrib.sites.models import Site
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.mail import send_mail
from django.utils.translation import ugettext as _
from django.utils import timezone
from django.template.loader import get_template
from django.template import Context

from simple_email_confirmation.models import SimpleEmailConfirmationUserMixin

from comun import models as common_models


class UsuarioManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_active', False)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class Usuario(SimpleEmailConfirmationUserMixin, AbstractBaseUser, PermissionsMixin):
    """
    A class implementing a fully featured User model with admin-compliant
    permissions.

    Email and password are required. Other fields are optional.
    """

    email = models.EmailField(
        _('Email Address'), unique=True,
        error_messages={
            'unique': _("A user with that email already exists."),
        }
    )
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    is_staff = models.BooleanField(
        _('Staff Status'), default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.')
    )
    is_active = models.BooleanField(
        _('Active'), default=False,
        help_text=_('Designates whether this user should be treated as '
                    'active. Unselect this instead of deleting accounts.')
    )
    date_joined = models.DateTimeField(_('Date Joined'), default=timezone.now)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'

    class Meta(object):
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        abstract = False

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()
    full_name = property(get_full_name)

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def __str__(self):
        if self.get_full_name():
            return '{nombre}'.format(nombre=self.get_full_name())
        else:
            return self.email

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def belongs_to_group(self, group):
        """ Checks whether the user belongs to the group parameter or not"""
        return self.grupos.filter(pk=group.pk).exists()

    def is_admin_of_group(self, group):
        """ Checks whether the user admins the group parameter or not"""
        return self.grupos_admin.filter(pk=group.pk).exists()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_email_confirmation(sender, instance=None, created=False, **kwargs):
    if created and not instance.is_superuser and not instance.is_active:
        mail_html = get_template('usuarios/email_confirmation.html')
        current_site = Site.objects.get_current()
        ctx = Context({
            'uidb64': urlsafe_base64_encode(force_bytes(instance.id)).decode(),
            'token': instance.confirmation_key,
            'protocol': settings.PROTOCOL,
            'domain': current_site.domain,
            'site_name': current_site.name
        })
        html_content = mail_html.render(ctx)

        instance.email_user('Confirmación de registro en WREM', html_content, fail_silently=False)


class Grupo(common_models.TimeStampedModel):
    nombre = models.CharField('nombre', max_length=500, blank=False, null=True)
    administrador = models.ForeignKey(
        'usuarios.Usuario', related_name='grupos_admin', verbose_name='administrador', blank=False, null=True,
        on_delete=models.SET_NULL
    )
    usuarios = models.ManyToManyField('usuarios.Usuario', verbose_name='usuarios', related_name='grupos', blank=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'usuarios_grupo'
        verbose_name = 'grupo'
        verbose_name_plural = 'grupos'
