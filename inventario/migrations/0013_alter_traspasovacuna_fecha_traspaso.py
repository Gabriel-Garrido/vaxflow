# Generated by Django 4.2.5 on 2023-10-26 14:02

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0012_alter_registroinventario_stock_final_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='traspasovacuna',
            name='fecha_traspaso',
            field=models.DateField(default=datetime.datetime.today),
        ),
    ]