from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from authentication.models import CustomUser

class Vacunatorio(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    telefono = models.CharField(max_length=20)
    codigo_deis = models.CharField(max_length=15)

    def __str__(self):
        return self.nombre

class Vacuna(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_caducidad_fabricante = models.DateField(null=True, blank=True)
    lote = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombre} (Lote: {self.lote}, Vencimiento: {self.fecha_caducidad_fabricante})"

class VacunaStock(models.Model):
    tipo_vacuna = models.ForeignKey(Vacuna, on_delete=models.CASCADE)
    stock = models.PositiveIntegerField()
    fecha_descongelacion = models.DateField(null=True, blank=True)
    fecha_caducidad_descongelacion = models.DateField(null=True, blank=True)
    hora_descongelacion = models.TimeField(null=True, blank=True)
    vacunatorio = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE)

    def __str__(self):
        fecha_descongelacion_str = f" - Descongelación: {self.fecha_descongelacion}" if self.fecha_descongelacion else ""
        return f"{self.vacunatorio.nombre} => {self.tipo_vacuna.nombre} - {str(self.stock)} - {str(fecha_descongelacion_str)}"

class TraspasoVacuna(models.Model):
    vacuna_traspaso = models.ForeignKey(VacunaStock, on_delete=models.CASCADE, related_name='traspasos_enviados')
    vacunatorio_origen = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE, related_name='traspasos_origen')
    vacunatorio_destino = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE, related_name='traspasos_destino')
    fecha_traspaso = models.DateTimeField(auto_now_add=True)
    cantidad_traspasada = models.PositiveIntegerField()
    responsable_entrega = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='traspasos_entrega')
    responsable_recepcion = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='traspasos_recepcion')

    def clean(self):
            if self.cantidad_traspasada <= 0:
                raise ValidationError("La cantidad de vacunas traspasada debe ser mayor que 0.")

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Verificar si la cantidad_traspasada es mayor que el stock del vacunatorio de origen
            if self.cantidad_traspasada > self.vacuna_traspaso.stock:
                raise ValidationError("La cantidad de vacunas traspasada es mayor que el stock disponible.")

            # Intentar obtener el VacunaStock en el vacunatorio destino
            vacuna_destino = VacunaStock.objects.filter(
                tipo_vacuna=self.vacuna_traspaso.tipo_vacuna,
                vacunatorio=self.vacunatorio_destino
            ).first()

            if not vacuna_destino:
                # Si no existe VacunaStock en el destino, créalo
                vacuna_destino = VacunaStock.objects.create(
                    tipo_vacuna=self.vacuna_traspaso.tipo_vacuna,
                    vacunatorio=self.vacunatorio_destino,
                    stock=0,  # Establecemos el stock en 0 para actualizarlo posteriormente
                    fecha_descongelacion=self.vacuna_traspaso.fecha_descongelacion,
                    fecha_caducidad_descongelacion=self.vacuna_traspaso.fecha_caducidad_descongelacion,
                    hora_descongelacion=self.vacuna_traspaso.hora_descongelacion  # Agregar la hora de descongelación
                )

            # Sumar la cantidad traspasada al stock en el destino
            vacuna_destino.stock += self.cantidad_traspasada
            vacuna_destino.save()


            super(TraspasoVacuna, self).save(*args, **kwargs)


class EliminacionVacuna(models.Model):
    vacuna = models.ForeignKey(VacunaStock, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    cantidad_eliminada = models.PositiveIntegerField()
    responsable_eliminacion = models.CharField(max_length=100)
    vacunatorio_eliminacion = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE)


    def save(self, *args, **kwargs):
        if self.cantidad_eliminada > self.vacuna.stock:
            raise ValidationError("La cantidad de vacunas eliminadas es mayor que el stock disponible.")

        with transaction.atomic():
            # Restar la cantidad eliminada del stock de la vacuna
            self.vacuna.stock -= self.cantidad_eliminada
            self.vacuna.save()

            super(EliminacionVacuna, self).save(*args, **kwargs)

class AdministracionVacuna(models.Model):
    vacuna = models.ForeignKey(VacunaStock, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    cantidad_administrada = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.cantidad_administrada > self.vacuna.stock:
            raise ValidationError("La cantidad de vacunas administradas es mayor que el stock disponible.")

        with transaction.atomic():
            # Restar la cantidad administrada del stock de la vacuna
            self.vacuna.stock -= self.cantidad_administrada
            self.vacuna.save()

            super(AdministracionVacuna, self).save(*args, **kwargs)