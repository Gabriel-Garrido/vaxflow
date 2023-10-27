# Generated by Django 4.2.5 on 2023-10-26 17:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0019_alter_administracionvacuna_fecha_and_more'),
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
            model_name='retirocamara',
            name='fecha',
            field=models.DateTimeField(default=datetime.datetime.today),
        ),
    ]
