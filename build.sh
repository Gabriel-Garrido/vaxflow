#!/usr/bin/env bash
# exit on error
set -o errexit

#render.com ejecunta esto automaticamente, por eso lo dejo comentado
#pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate