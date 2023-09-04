# Generated by Django 4.2.4 on 2023-09-04 21:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('inventario', '0004_alter_traspasovacuna_responsable_entrega_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='traspasovacuna',
            name='responsable_entrega',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='traspasos_entrega', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='traspasovacuna',
            name='responsable_recepcion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='traspasos_recepcion', to=settings.AUTH_USER_MODEL),
        ),
    ]
