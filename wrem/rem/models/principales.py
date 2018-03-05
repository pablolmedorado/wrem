from datetime import timedelta

from django.utils import timezone
from django.db import models

from comun import models as common_models


class LogREM(models.Model):
    proyecto = models.ForeignKey(
        'rem.ProyectoREM', related_name='logs', verbose_name='proyecto', blank=True, null=True, on_delete=models.CASCADE
    )
    documento = models.ForeignKey(
        'rem.DocumentoREM', related_name='logs', verbose_name='documento', blank=True, null=True,
        on_delete=models.CASCADE
    )
    objeto = models.ForeignKey(
        'rem.ObjetoREM', related_name='logs', verbose_name='objeto', blank=True, null=True, on_delete=models.CASCADE
    )
    fecha = models.DateTimeField(auto_now_add=True, verbose_name='fecha', blank=True, null=True)
    descripcion = models.TextField('descripción', blank=True, null=True)

    def __str__(self):
        return '{fecha} - {descripcion}'.format(fecha=self.fecha, descripcion=self.descripcion)

    class Meta:
        db_table = 'wrem_log'
        verbose_name = 'registro de log'
        verbose_name_plural = 'registros de log'


class ProyectoREM(common_models.TimeStampedModel):
    nombre = models.CharField('nombre', max_length=500, blank=False, null=False)
    autor = models.ForeignKey(
        'usuarios.Usuario', related_name='proyectos', verbose_name='autor', blank=False, null=True,
        on_delete=models.SET_NULL
    )
    grupos = models.ManyToManyField('usuarios.Grupo', verbose_name='grupos', related_name='proyectos', blank=True)
    fecha_ultima_apertura = models.DateTimeField(blank=True, null=True, verbose_name='fecha de última apertura')
    usuario_ultima_apertura = models.ForeignKey(
        'usuarios.Usuario', related_name='+', verbose_name='usuario de última apertura', blank=False, null=True,
        on_delete=models.SET_NULL
    )

    def can_be_modified_by(self, user):
        if user == self.usuario_ultima_apertura or not self.fecha_ultima_apertura:
            return True
        else:
            return (self.fecha_ultima_apertura + timedelta(minutes=5)) < timezone.now()

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = 'wrem_proyecto'
        verbose_name = 'proyecto'
        verbose_name_plural = 'proyectos'


class DocumentoREM(common_models.TimeStampedModel):
    proyecto = models.ForeignKey(
        'rem.ProyectoREM', related_name='documentos', verbose_name='proyecto', blank=False, null=False,
        on_delete=models.CASCADE
    )
    autor = models.ForeignKey(
        'usuarios.Usuario', related_name='documentos', verbose_name='autor', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    nombre = models.CharField('nombre', max_length=500, blank=False, null=False)
    version = models.CharField('versión', max_length=10, blank=True, null=True, default='1.0')
    organizacion_por = models.ForeignKey(
        'rem.OrganizacionREM', related_name='+', verbose_name='organización por', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    organizacion_para = models.ForeignKey(
        'rem.OrganizacionREM', related_name='+', verbose_name='organización para', blank=True, null=True,
        on_delete=models.SET_NULL
    )
    comentarios = models.TextField('comentarios', blank=True, null=True)

    def can_be_modified_by(self, user):
        return self.proyecto.can_be_modified_by(user)

    def __str__(self):
        return '{nombre} [{proyecto}]'.format(nombre=self.nombre, proyecto=self.proyecto)

    class Meta:
        db_table = 'wrem_documento'
        verbose_name = 'documento'
        verbose_name_plural = 'documentos'
