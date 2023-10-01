#!/usr/bin/env bash
# exit on error
set -o errexit

# poetry install
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Crear un superusuario de Django
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'gabrielgarrido89@gmail.com', 'gabriel43')" | python manage.py shell
