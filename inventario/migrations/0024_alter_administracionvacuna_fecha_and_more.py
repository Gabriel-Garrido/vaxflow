# Generated by Django 4.2.5 on 2023-10-26 18:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0023_alter_registroinventario_fecha'),
    ]

    operations = [
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
            model_name='registroinventario',
            name='fecha',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='retirocamara',
            name='fecha',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
    ]