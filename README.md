# Nombre del Proyecto

**VaxFlow** es una aplicación web que gestiona el inventario de vacunas en varios vacunatorios. La aplicación está construida con Django y React.

## Descripción

**VaxFlow** se ha desarrollado para facilitar la gestión eficiente de las existencias de vacunas en diferentes vacunatorios. Permite a los administradores realizar un seguimiento detallado de las vacunas, incluida su fecha de vencimiento, número de lote y estado de congelación. Los principales componentes de la aplicación incluyen:

- **Gestión de Stock:** Los usuarios pueden ver y actualizar el stock de vacunas en cada vacunatorio. La información incluye detalles sobre la fecha de descongelación y la fecha de vencimiento.
- **Traspasos:** Los usuarios pueden realizar traspasos de vacunas entre vacunatorios. El sistema garantiza que no se transfieran más vacunas de las disponibles.
- **Eliminación:** Los usuarios pueden registrar la eliminación de vacunas, lo que ayuda a mantener un registro claro de las vacunas disponibles y elimina las vacunas no utilizables.
- **Administración:** Los usuarios pueden registrar la cantidad de vacunas administradas y mantener un seguimiento del stock restante.
- **Historial:** La aplicación registra un historial de traspasos, eliminaciones y administraciones de vacunas para fines de seguimiento y auditoría.


## Tecnologías Utilizadas

El proyecto utiliza las siguientes tecnologías:

- **Django:** Un marco de desarrollo web de Python para el backend de la aplicación.
- **React:** Una biblioteca de JavaScript para la interfaz de usuario.
- **Render.com:** Un servicio de alojamiento web utilizado para el despliegue de la aplicación.
- **Pytz:** Una biblioteca de Python para trabajar con zonas horarias.
- **Django Rest Framework:** Una extensión de Django para la creación de API REST.
- **React Router:** Para el enrutamiento en la aplicación React.

## Configuración del Entorno

A continuación, se describen los pasos para configurar el entorno de desarrollo:

1. Clona el repositorio en tu máquina local: `git clone https://github.com/Gabriel-Garrido/vaxflow.git`.
2. Crea un entorno virtual de Python e instala las dependencias del backend: `pip install -r requirements.txt`.
3. Configura la base de datos en tu entorno local y aplica las migraciones: `python manage.py migrate`.
4. Configura las variables de entorno, como la clave secreta y las configuraciones de base de datos, en un archivo `.env`.
5. Navega al directorio `client` y ejecuta `npm install` para instalar las dependencias del frontend.

## Ejecución Local

Después de configurar el entorno, puedes ejecutar la aplicación localmente siguiendo estos pasos:

1. Abre una terminal y navega al directorio raíz del proyecto.
2. Activa tu entorno virtual de Python.
3. Inicia el servidor de desarrollo de Django con `python manage.py runserver`.
4. Abre otra terminal y navega al directorio `client`.
5. Ejecuta la aplicación React con `npm run dev`.
6. Accede a la aplicación en tu navegador visitando `http://localhost:5173/`.

