# CRYPTO

Aplicación web para el registro de valores de cryptomonedas. Proyecto final del Bootcamp de Programación con Python de KeepCoding.

## Comenzando 🚀

### Pre-requisitos 📋


Se necesita python 3.8 o superior

### Instalación 🔧

Se instala un paquete para poder crear entorno virtuales, esto se hace desde la terminal con los siguientes comandos:

```
pip install virtualenv
```

Se crea el entorno virtual desde el proyecto
```
virtualenv venv
``` 
Se activa el entorno virtual
##### En linux/mac
```
source venv/bin/activate
```
##### En Windows
```
.\venv\scripts\activate
```

Se descarga las librerias para poder arrancar el proyecto
```
pip install -r requirements.txt
```  

Se crea la base de datos y un archivo .env siguiente el archivo .env.example completando los datos de nuestra base de datos. Necesitamos rellenar la tabla currency con las monedas disponibles  

### Corremos las migraciones
```
python app.py migrate
```

### Corremos el server
```
python app.py
```
Se abre el archivo frontend/index.html en el navegador


## Construido con 🛠️

* Vanila JS
* Flask Restful
* PostgreSQL
* CSS
