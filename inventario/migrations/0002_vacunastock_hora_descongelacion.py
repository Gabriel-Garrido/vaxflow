# Generated by Django 4.2.4 on 2023-08-22 21:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vacunastock',
            name='hora_descongelacion',
            field=models.TimeField(blank=True, default=django.utils.timezone.now, null=True),
        ),
    ]
