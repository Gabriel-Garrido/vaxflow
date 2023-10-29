from django.db import models

# Entidad para representar los diferentes tipos de vacunas
class Vacuna(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    # Otros campos relacionados a las vacunas (fabricante, tipo, etc.)

    def __str__(self):
        return self.nombre

# Entidad para representar los vacunatorios
class Vacunatorio(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

# Entidad para representar el inventario de vacunas en un vacunatorio
class InventarioVacuna(models.Model):
    vacuna = models.ForeignKey(Vacuna, on_delete=models.CASCADE)
    vacunatorio = models.ForeignKey(Vacunatorio, on_delete=models.CASCADE)
    lote = models.CharField(max_length=100)
    fecha_caducidad_fabricante = models.DateField()
    fecha_descongelacion = models.DateField(null=True, blank=True)
    fecha_caducidad_descongelacion = models.DateField(null=True, blank=True)
    hora_descongelacion = models.TimeField(null=True, blank=True)
    fecha_eliminacion = models.DateField(null=True, blank=True, default=None)
    fecha_administracion = models.DateField(null=True, blank=True, default=None)
    
    existe = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.vacuna.nombre} - {self.lote} en {self.vacunatorio}"

# Entidad para representar el retiro de vacunas de la cámara de descongelación
class RetiroCamara(models.Model):
    inventario_vacuna = models.ForeignKey(InventarioVacuna, on_delete=models.CASCADE)
    fecha_retiro = models.DateTimeField()
    cantidad_retirada = models.PositiveIntegerField()

    def __str__(self):
        return f"Retiro de {self.cantidad_retirada} de {self.inventario_vacuna.vacuna.nombre} en {self.inventario_vacuna.vacunatorio.nombre}"

# Entidad para representar el traspaso de vacunas entre vacunatorios
class TraspasoVacuna(models.Model):
    origen = models.ForeignKey(Vacunatorio, related_name='traspasos_realizados', on_delete=models.CASCADE)
    destino = models.ForeignKey(Vacunatorio, related_name='traspasos_recibidos', on_delete=models.CASCADE)
    inventario_vacuna = models.ForeignKey(InventarioVacuna, on_delete=models.CASCADE)
    fecha_traspaso = models.DateTimeField()
    cantidad_traspasada = models.PositiveIntegerField()

    def __str__(self):
        return f"Traspaso de {self.cantidad_traspasada} de {self.inventario_vacuna} de {self.origen} a {self.destino}"

# Entidad para representar la eliminación de vacunas por diversos motivos
class EliminacionVacuna(models.Model):
    inventario_vacuna = models.ForeignKey(InventarioVacuna, on_delete=models.CASCADE)
    fecha_eliminacion = models.DateTimeField()
    motivo_eliminacion = models.CharField(max_length=200)

    def __str__(self):
        return f"Eliminación de {self.inventario_vacuna} por {self.motivo_eliminacion}"

# Entidad para representar la administración de vacunas en un vacunatorio
class AdministracionVacuna(models.Model):
    inventario_vacuna = models.ForeignKey(InventarioVacuna, on_delete=models.CASCADE)
    fecha_administracion = models.DateTimeField()
    cantidad_administrada = models.PositiveIntegerField()

    def __str__(self):
        return f"Administración de {self.cantidad_administrada} de {self.inventario_vacuna}"

