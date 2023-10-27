from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from authentication.models import CustomUser
from datetime import datetime, date

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
    congelacion = models.BooleanField(null=False, blank=False, default=True)

    def __str__(self):
        return f"{self.nombre} (Lote: {self.lote}, Vencimiento: {self.fecha_caducidad_fabricante})"

class VacunaStock(models.Model):
    tipo_vacuna = models.ForeignKey(Vacuna, on_delete=models.CASCADE)
    stock = models.PositiveIntegerField()
    fecha_descongelacion = models.DateField(null=True, blank=True)
    fecha_caducidad_descongelacion = models.DateField(null=True, blank=True)
    hora_descongelacion = models.TimeField(null=True, blank=True)
    hora_caducidad_descongelacion = models.TimeField(null=True, blank=True)
    vacunatorio = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE)

    def __str__(self):
        fecha_descongelacion_str = f" - Descongelación: {self.fecha_descongelacion}" if self.fecha_descongelacion else ""
        return f"{self.vacunatorio.nombre} => {self.tipo_vacuna.nombre} - {str(self.stock)} - {str(fecha_descongelacion_str)}"

    def save(self, *args, **kwargs):
        # Calcular la hora_caducidad_descongelacion 1 minuto antes de la hora_descongelacion
        if self.hora_descongelacion and not self.hora_caducidad_descongelacion:
            self.hora_caducidad_descongelacion = (timezone.datetime.combine(timezone.datetime.today(), self.hora_descongelacion) - timezone.timedelta(minutes=1)).time()
        super(VacunaStock, self).save(*args, **kwargs)
        
class RetiroCamara(models.Model):
    vacuna_retiro = models.ForeignKey(VacunaStock, on_delete=models.CASCADE)
    fecha = models.DateTimeField(default=datetime.today)
    cantidad_retirada = models.PositiveIntegerField()
    responsable_retiro = models.CharField(max_length=100)
    vacunatorio_retiro = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.fecha} => {self.vacuna_retiro} - {str(self.cantidad_retirada)} - {str(self.vacunatorio_retiro)}"

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Asegurarse de que la cantidad retirada sea mayor que 0
            if self.cantidad_retirada <= 0:
                raise ValidationError("La cantidad de vacunas retiradas debe ser mayor que 0.")

            # Sumar la cantidad retirada al stock de VacunaStock
            self.vacuna_retiro.stock += self.cantidad_retirada
            self.vacuna_retiro.save()

            super(RetiroCamara, self).save(*args, **kwargs)
    
class RegistroInventario(models.Model):
    vacuna_stock = models.ForeignKey(VacunaStock, on_delete=models.CASCADE)
    fecha = models.DateField(default=date.today)
    stock_inicial = models.IntegerField(null=True, blank=True)
    stock_final = models.PositiveIntegerField(null=True, blank=True)
    traspasos_entrantes = models.PositiveIntegerField(default=0)
    traspasos_salientes = models.PositiveIntegerField(default=0)
    eliminaciones = models.PositiveIntegerField(default=0)
    retiros_camara = models.PositiveIntegerField(default=0)
    administraciones = models.PositiveIntegerField(default=0)
    
    def save(self, *args, **kwargs):
        # Calcular stock_final
        self.stock_final = self.vacuna_stock.stock
        formatted_date = self.fecha.strftime('%Y-%m-%d')  # Formatear la fecha para comparar con registros

        # Calcular stock_inicial
        stock_inicial = self.vacuna_stock.stock
        
        # Calcular traspasos entrantes con la misma fecha
        traspasos_entrantes = TraspasoVacuna.objects.filter(
        vacunatorio_destino=self.vacuna_stock.vacunatorio,  # Mismo vacunatorio de destino
        fecha_traspaso=formatted_date,  # Misma fecha
        vacuna_traspaso__tipo_vacuna=self.vacuna_stock.tipo_vacuna,  # Misma vacuna
        vacuna_traspaso__tipo_vacuna__lote=self.vacuna_stock.tipo_vacuna.lote,  # Mismo lote
        vacuna_traspaso__tipo_vacuna__fecha_caducidad_fabricante=self.vacuna_stock.tipo_vacuna.fecha_caducidad_fabricante,  # Misma fecha de caducidad fabricante
        vacuna_traspaso__fecha_caducidad_descongelacion=self.vacuna_stock.fecha_caducidad_descongelacion  # Misma fecha de caducidad por descongelación
    ).aggregate(models.Sum('cantidad_traspasada'))['cantidad_traspasada__sum'] or 0


        

        # Calcular traspasos salientes con la misma fecha
        traspasos_salientes = TraspasoVacuna.objects.filter(
            vacuna_traspaso=self.vacuna_stock,
            fecha_traspaso=formatted_date,
            vacunatorio_origen=self.vacuna_stock.vacunatorio
        ).aggregate(models.Sum('cantidad_traspasada'))['cantidad_traspasada__sum'] or 0
        
        # Calcular eliminaciones con la misma fecha
        eliminaciones = EliminacionVacuna.objects.filter(vacuna=self.vacuna_stock, fecha__date=self.fecha).aggregate(models.Sum('cantidad_eliminada'))['cantidad_eliminada__sum'] or 0

        # Calcular retiros de cámara con la misma fecha
        retiros_camara = RetiroCamara.objects.filter(
            vacuna_retiro=self.vacuna_stock,
            fecha__date=self.fecha
        ).aggregate(models.Sum('cantidad_retirada'))['cantidad_retirada__sum'] or 0

        # Calcular administraciones con la misma fecha
        administraciones = AdministracionVacuna.objects.filter(vacuna=self.vacuna_stock, fecha__date=self.fecha).aggregate(models.Sum('cantidad_administrada'))['cantidad_administrada__sum'] or 0

        stock_inicial += traspasos_salientes
        stock_inicial += eliminaciones
        stock_inicial += administraciones
        stock_inicial -= traspasos_entrantes
        stock_inicial -= retiros_camara

        self.stock_inicial = stock_inicial
        self.traspasos_entrantes = traspasos_entrantes
        self.traspasos_salientes = traspasos_salientes
        self.eliminaciones = eliminaciones
        self.retiros_camara = retiros_camara
        self.administraciones = administraciones

        super(RegistroInventario, self).save(*args, **kwargs)


class TraspasoVacuna(models.Model):
    vacuna_traspaso = models.ForeignKey(VacunaStock, on_delete=models.CASCADE, related_name='traspasos_enviados')
    vacunatorio_origen = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE, related_name='traspasos_origen')
    vacunatorio_destino = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE, related_name='traspasos_destino')
    fecha_traspaso = models.DateField(default=date.today)
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
            
            # Restar la cantidad traspasada del stock en el origen
            self.vacuna_traspaso.stock -= self.cantidad_traspasada
            self.vacuna_traspaso.save()


            super(TraspasoVacuna, self).save(*args, **kwargs)


class EliminacionVacuna(models.Model):
    vacuna = models.ForeignKey(VacunaStock, on_delete=models.CASCADE)
    fecha = models.DateTimeField(default=datetime.today)
    cantidad_eliminada = models.PositiveIntegerField()
    responsable_eliminacion = models.CharField(max_length=100)
    motivo_eliminacion = models.CharField(max_length=100, default="otro")
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
    fecha = models.DateTimeField(default=datetime.today)
    cantidad_administrada = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.cantidad_administrada > self.vacuna.stock:
            raise ValidationError("La cantidad de vacunas administradas es mayor que el stock disponible.")

        with transaction.atomic():
            # Restar la cantidad administrada del stock de la vacuna
            self.vacuna.stock -= self.cantidad_administrada
            self.vacuna.save()

            super(AdministracionVacuna, self).save(*args, **kwargs)