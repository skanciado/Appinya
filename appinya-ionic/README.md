Comienza a trabajar con Appinya
=============================

- [Como funciona?](#como-funciona) 
- [Entorno Desarrollo](#entorno-desarrollo)
- [Montar el entorno](#montar-el-entorno)
- [Ejecutar el entorno](#ejecutar-el-entorno)
- [Soporte](#Soporte)

# Como Funciona
El proyecto Appinya es un proyecto de codigo abierto compuesto por dos proyectos distintos.
* **Parte Servidora** Este parte servidora es la responsable de almacenar y gestionar la información de la colla. Esta parte se comunica con un servidor de base de datos.
 :page_facing_up: [Link Repo](https://github.com/skanciado/Appinya/tree/master/appinya-api)
* **Parte Cliente**. La parte cliente es la responsable de mostrar la información de la parte servidora. 
:page_facing_up: [Link Repo](https://github.com/skanciado/Appinya/tree/master/appinya-ionic)



# Entorno Desarrollo

El entorno de desarrollo necesario para compilar y ejecutar el entorno Appinya-client es el siguiente.
1. Instalar nodejs 16 ( Ver https://nodejs.org/dist/v16.18.1/)
1. Instalar Xcode y Android Studio (en el caso de compilar en IOS o Android)

Como IDEs recomendados nosotros utilizamos el Visual Studio Code, pero como ya sabes es cosa tuya ;).

 # Montar el entorno

Para montar el entorno es bastante sencillo pero hay que ir con cuidado con las versiones de node y ionic!
Antes ir a la carpeta del proyecto e introducir por terminal la siguiente sentecia para descargar los paquetes en el ámbito general:
```cmd
npm install -g cordova ionic@5.0.0 
```
Luego para instalar los paquetes locales del proyecto ( Importante estar dentro del la carpeta del proyecto )
```cmd 
npm install
```
Corrige los errores de seguridad , con esta otra sentencia
```
npm audit fix
```

Ahora ya tenemos el entorno montado, ahora falta configurar las variables de tu proyecto y configurar el docker de backend.

Para configurar en el entorno de desarrollo del backend ir al repo del back i seguir las instrucciones. Pero si soys developers de Front en la parte back encontrareis el Docker-Compose para montar las capas servidoras de forma sencilla y facil.

En esta documentación asumo que utilizamos Docker compose para montarlo.

Vamos a acabar de configurar el proyecto ....por un lado tenemos que modificar 2 ficheros clave dentro de appinya-ionic:
1. Fichero de tu personalizacion src/enviroments/environment.xxxxx.ts
1. Configurar Angular para compilar tu personalización en angular.json


Por un lado os pongo un ejemplo para configuración del enviroment.jdbcn.dev.ts (para ejecutar en local con el Look And Fill de La Jove de Barcelona)
```enviroment.jdbcn.dev.ts
export const environment = {
  production: false,
  UrlServidor: "http://localhost:8080",
  UrlServidorAutentificacion: "http://localhost:8080",
  logoComplet: "assets/jdbcn/logo/logo-gran.png",
  logo: "assets/jdbcn/logo/logo.png",
  colla: "la Jove de Barcelona",
  timeOutRequest: 25000,
  /* Ubicaci� del lloc d'entrenaments */
  LLOC_ENTRENAMENT_LATITUD: 41.4331557,
  LLOC_ENTRENAMENT_LONGITUD: 2.1917846,
  /* API de Google KEY */
  API_GOOGLE_KEY: "XXXXXXXX",
  firebaseConfig: {
    apiKey: "XXXXXXX-XXXXX",
    authDomain: "appinya-a0e54.firebaseapp.com",
    projectId: "appinya-a0e54",
    storageBucket: "appinya-XXXXX.appspot.com",
    messagingSenderId: "XXXXXX",
    appId: "1:XXXXXX:web:XXXXX",
    measurementId: "G-XXXXXX",
  },
  GoogleoAuth: {
    client_id:
      "XXXXXX-XXXXXXX.apps.googleusercontent.com",
    project_id: "appinya-a0e54",
    storage_bucket: "appinya-a0e54.appspot.com",
  },
};
```
 # Ejecutar el entorno
 
 ```
ionic serve --configuration=jdbcn.dev
```
Abrir un navegador con la url  http://localhost:8100.
NOTA: al conectarte recuerda ir a la base de datos a la tabla TEMPORADA para iniciar una temporada para poder iniciar

# Soporte
Cualquier duda o mejora o si necesitais soporte enviarme un correo a skanciado@gmail.com.

Gracias.