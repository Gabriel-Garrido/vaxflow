# Generated by Django 4.2.5 on 2023-10-26 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventario', '0015_rename_cantidad_retiro_retirocamara_cantidad_retirada_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registroinventario',
            name='stock_inicial',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
