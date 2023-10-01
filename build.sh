#!/usr/bin/env bash
# exit on error
set -o errexit

# poetry install
pip install -r requirements.txt

# Obtener los datos del superusuario de la variable de entorno SUPERUSER
SUPERUSER_DATA=$SUPERUSER

# Verificar si la variable SUPERUSER está definida
if [ ! -z "$SUPERUSER_DATA" ]; then
  # Parsear los datos JSON
  SUPERUSER_USERNAME=$(echo $SUPERUSER_DATA | jq -r '.username')
  SUPERUSER_PASSWORD=$(echo $SUPERUSER_DATA | jq -r '.password')
  SUPERUSER_EMAIL=$(echo $SUPERUSER_DATA | jq -r '.email')

  # Crear el superusuario si no existe
  python manage.py shell <<EOF
from django.contrib.auth.models import User

if not User.objects.filter(username='$SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$SUPERUSER_USERNAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')
EOF
fi

python manage.py collectstatic --no-input
python manage.py migrate
