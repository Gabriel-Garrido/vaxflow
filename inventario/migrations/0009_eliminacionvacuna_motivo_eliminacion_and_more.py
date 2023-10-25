# Generated by Django 4.2.5 on 2023-10-25 03:36

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0008_alter_administracionvacuna_fecha_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eliminacionvacuna',
            name='motivo_eliminacion',
            field=models.CharField(default='otro', max_length=100),
        ),
        migrations.AlterField(
            model_name='administracionvacuna',
            name='fecha',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
        migrations.AlterField(
            model_name='eliminacionvacuna',
            name='fecha',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
        migrations.AlterField(
            model_name='retirocamara',
            name='fecha_retiro',
            field=models.DateField(default=datetime.datetime.today),
        ),
        migrations.AlterField(
            model_name='traspasovacuna',
            name='fecha_traspaso',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
    ]
