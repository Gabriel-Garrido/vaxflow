# Generated by Django 4.2.5 on 2023-10-26 18:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0022_alter_eliminacionvacuna_fecha'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registroinventario',
            name='fecha',
            field=models.DateTimeField(default=datetime.date.today),
        ),
    ]
