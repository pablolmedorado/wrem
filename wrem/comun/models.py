from django.db import models
from polymorphic.models import PolymorphicModel


class TimeStampedModel(models.Model):
    creado = models.DateTimeField(
        auto_now_add=True, blank=True, null=True, verbose_name="fecha de creación",
    )
    modificado = models.DateTimeField(
        auto_now=True, blank=True, null=True, verbose_name="fecha de modificación",
    )

    class Meta:
        abstract = True
        verbose_name = "modelo con sello de tiempo"
        verbose_name_plural = "modelos con sello de tiempo"


class PolymorphicTimeStampedModel(PolymorphicModel):
    creado = models.DateTimeField(
        auto_now_add=True, blank=True, null=True, verbose_name="fecha de creación",
    )
    modificado = models.DateTimeField(
        auto_now=True, blank=True, null=True, verbose_name="fecha de modificación",
    )

    class Meta:
        abstract = True
        verbose_name = "modelo polimorfico con sello de tiempo"
        verbose_name_plural = "modelos polimorficos con sello de tiempo"
