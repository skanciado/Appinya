
Comienza a trabajar con Appinya
=============================

- [Como funciona?](#como-funciona)
- [Soy de Front, que hago?](#soy-de-front-que-hago)
- [Entorno Desarrollo Back](#entorno-desarrollo-back)
- [Comprobar el entorno](#comprobar-el-entorno)
- [Crear un usuario] (#crear_usuario)
- [Soporte](#Soporte)


# Como Funciona
El proyecto Appinya es un proyecto de codigo abierto compuesto por dos proyectos distintos.
* **Parte Servidora** Este parte servidora es la responsable de almacenar y gestionar la información de la colla. Esta parte se comunica con un servidor de base de datos.
 :page_facing_up: [Link Repo](https://github.com/skanciado/Appinya/tree/master/appinya-api)
* **Parte Cliente**. La parte cliente es la responsable de mostrar la información de la parte servidora. 
:page_facing_up: [Link Repo](https://github.com/skanciado/Appinya/tree/master/appinya-ionic)

# Soy de Front, que hago?
Este proyecto está divido en dos proyectos, uno basado en tecnologías Front (HTML, CSS ,TS,JS,IONIC , ...) y otro en tecnolías Back (NetCore , SQL Server). 

Para equipos basados en tecnologias front se ha diseñado un **docker compose** para poder ejecutar el backend sin necesidad de tener el entorno de desarrollo de back instalado.
Como activar el docker-Compose? muy facil!. 
1. Debeis descargaros el proyecto Appinya-api.
1. Crear un fichero appsettings.Docker en la carpeta del proyecto (\AppinyaServerCore). Os adjunto un ejemplo , copiarlo i pegarlo si quereis ;) :
```appsettings.Docker
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:appinya-db,1433;Initial Catalog=appinyadb;Persist Security Info=False;User ID=sa;Password=!Appinya2021;MultipleActiveResultSets=False;TrustServerCertificate=False;Connection Timeout=30;",
    "IdentityConnection": "Server=tcp:appinya-db,1433;Initial Catalog=identitydb;Persist Security Info=False;User ID=sa;Password=!Appinya2021;MultipleActiveResultSets=False;TrustServerCertificate=False;Connection Timeout=30;"
  },
  "AppSettings": {
    "UrlGooglePlay": "http://play.google.com/store/apps/details?id=cat.tudominio.Appinya",
    "UrlAppleStore": "https://apps.apple.com/es/app/appinya/xxxx?l=ca",
    "UrlWebApp": "../../../../indexclient.html",
    "UrlResources": "http://appinya.tudominio.cat/Resources/",
    "UrlConfirmacioEmail": "http://appinya.tudominio.cat/api/v2/assistencia/confirmacio",
    "JwtKey": "ahhjQlzmsjeug98372kIIuarirrolla98n45tip12ananotecfor123AaIURlk23138uqaj233",
    "JwtIssuer": "http://appinya.cat",
    "JwtExpireDays": 30,
    "JwtRefreshDays": 60,
    "UsuariAdmin": "admin@appinya.com",
    "PasswordAdmin": "12345678",
    "UsuariTest": "test@appinya.com",
    "PasswordTest": "12345678"
  },
  "EmailSettings": {
    "MailingEnable": false,
    "MailingTest": "skanciado@gmail.com",
    "Server": "smtp.tudominio.com",
    "Port": 587,
    "SSL": true,
    "From": "appinya@tudominio.cat",
    "UsuariPrincipal": "suport.appinya@tudominio.cat",
    "ContrasenyaPrincipal": "xxxxx",
    "UsuariSupport": "suport.appinya@tudominio.cat",
    "ContrasenyaSupport": "xxxxxx",
    "TemlateError": "EmailTemplates/generic/templateError.html",
    "TemplateBenvinguda": "EmailTemplates/generic/templateBenvinguda.html",
    "TemplateComisions": "EmailTemplates/generic/templateComisio.html",
    "TemplateSuport": "EmailTemplates/generic/templateSuport.html",
    "TemplateConfirmacio": "EmailTemplates/generic/templateConfirmacio.html",
    "TemplateContrasenya": "EmailTemplates/generic/templateCanviarContrasenya.html",
    "TemplateAssistencia": "EmailTemplates/generic/templateAssistencia.html",
    "TemplateConvocatoria": "EmailTemplates/generic/templateConvocatoria.html",
    "TemplateExportacio": "EmailTemplates/generic/templateExportacio.html",
    "TemplateAlbums": "EmailTemplates/generic/templateAlbums.html",
    "TemplateNoticies": "EmailTemplates/generic/templateNoticies.html"
  },
  "Google": {
    "ClientId": "XXXXXXXXX.apps.googleusercontent.com",
    "ClientSecret": "XXXXXXXXXXXXXX"
  },
  "Logging": {
    "IncludeScopes": true,
    "LogLevel": {
      "Default": "Warning",
      "AppinyaServerCore": "Debug",
      "AppinyaLibCore": "Debug",
      "Microsoft.Hosting.Lifetime": "Information"
    }, 
    "Console": {
      "IncludeScopes": true
    }}}
```
1. Instalar dotnet link https://dotnet.microsoft.com/en-us/download
1. Por ultimo, ejecutar el comando em la raiz del proyecto (donde está el fichero docker-compose) 
``` Docker-Compose
docker-compose up
```

# Entorno Desarrollo Back

Mi propuesta de IDE de desarrollo es la siguiente:
1. Visual Studio Comunity Edition (si teneis pasta otro mejor)
1. Sql Manager Studio 
1. Docker Desktop

** Instalación de la Base de datos **
Para tener una base de datos limpia y sin datos se debe ejecutar las siguientes lineas de comandos:
``` Docker-Compose
docker push skanciado/appinya-db
docker run -p 1433:1433 -e SA_PASSWORD=!Appinya2021  -e ACCEPT_EULA='Y' skanciado/appinya-db
```
Temas a tener en cuenta :
1. Recordar que la contraseña de esta base de datos es **!Appinya2021** y el usuario es **sa**
1. Recordar cambiar los conectionsStrings del fichero appsettings.json o crear uno nuevo. Os adjunto un appsettings que os puede servir para este primer paso.
```appsettings
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:127.0.0.1,1433;Initial Catalog=appinyadb;Persist Security Info=False;User ID=sa;Password=!Appinya2021;MultipleActiveResultSets=False;TrustServerCertificate=False;Connection Timeout=30;",
    "IdentityConnection": "Server=tcp:127.0.0.1,1433;Initial Catalog=identitydb;Persist Security Info=False;User ID=sa;Password=!Appinya2021;MultipleActiveResultSets=False;TrustServerCertificate=False;Connection Timeout=30;"
  },
  "AppSettings": {
    "UrlGooglePlay": "http://play.google.com/store/apps/details?id=cat.tudominio.Appinya",
    "UrlAppleStore": "https://apps.apple.com/es/app/appinya/xxxx?l=ca",
    "UrlWebApp": "../../../../indexclient.html",
    "UrlResources": "http://appinya.tudominio.cat/Resources/",
    "UrlConfirmacioEmail": "http://appinya.tudominio.cat/api/v2/assistencia/confirmacio",
    "JwtKey": "ahhjQlzmsjeug98372kIIuarirrolla98n45tip12ananotecfor123AaIURlk23138uqaj233",
    "JwtIssuer": "http://appinya.cat",
    "JwtExpireDays": 30,
    "JwtRefreshDays": 60,
    "UsuariAdmin": "admin@appinya.com",
    "PasswordAdmin": "12345678",
    "UsuariTest": "test@appinya.com",
    "PasswordTest": "12345678"
  },
  "EmailSettings": {
    "MailingEnable": false,
    "MailingTest": "skanciado@gmail.com",
    "Server": "smtp.tudominio.com",
    "Port": 587,
    "SSL": true,
    "From": "appinya@tudominio.cat",
    "UsuariPrincipal": "suport.appinya@tudominio.cat",
    "ContrasenyaPrincipal": "xxxxx",
    "UsuariSupport": "suport.appinya@tudominio.cat",
    "ContrasenyaSupport": "xxxxxx",
    "TemlateError": "EmailTemplates/generic/templateError.html",
    "TemplateBenvinguda": "EmailTemplates/generic/templateBenvinguda.html",
    "TemplateComisions": "EmailTemplates/generic/templateComisio.html",
    "TemplateSuport": "EmailTemplates/generic/templateSuport.html",
    "TemplateConfirmacio": "EmailTemplates/generic/templateConfirmacio.html",
    "TemplateContrasenya": "EmailTemplates/generic/templateCanviarContrasenya.html",
    "TemplateAssistencia": "EmailTemplates/generic/templateAssistencia.html",
    "TemplateConvocatoria": "EmailTemplates/generic/templateConvocatoria.html",
    "TemplateExportacio": "EmailTemplates/generic/templateExportacio.html",
    "TemplateAlbums": "EmailTemplates/generic/templateAlbums.html",
    "TemplateNoticies": "EmailTemplates/generic/templateNoticies.html"
  },
  "Google": {
    "ClientId": "XXXXXXXXX.apps.googleusercontent.com",
    "ClientSecret": "XXXXXXXXXXXXXX"
  },
  "Logging": {
    "IncludeScopes": true,
    "LogLevel": {
      "Default": "Warning",
      "AppinyaServerCore": "Debug",
      "AppinyaLibCore": "Debug",
      "Microsoft.Hosting.Lifetime": "Information"
    }, 
    "Console": {
      "IncludeScopes": true
    }}}
```
La estructura del proyecto es la siguiente:
| Carpeta | funcion |
| :---:   |  :---: |
| Controllers |  Es una carpeta que tiene todas las APIS REST del aplicativo  |
| EmailTemplates |  Recursos estáticos asociados a Templates de correos electrónicos   |
| Database |  Todo el Modelo EF de las dos bases de datos (autenticación y base de datos appinya). Tambien tiene el historial de scripts realizados a lo largo del proyecto (de esta ultima etapa)    |
| Excepcions |  Las dos posibles clases de excepciones (internas) de la app  (NegociException,SeguretatException)  |
| Helpers |  Todas las clases que se han utilizado con el patron helper  |
| Jobs |  Dentro de la app hay una serie de Jobs que se ejecutan temporalmente, si quereis verlos esta es la carpeta  |
| Models |  El Modelo de datos al completo. Conjunto de clases ;)  |
| Resources |  El Multilanguage de los mensajes enviados por el Back  |
| Services |  Aqui esta todo el Business, esta definido un servicio por unidad funcional (noticias, eventos, participantes , ...)  |
| Utils |  Clases de utilidades (imagenes , webapi ....)  |
| appsettings.json |  Configuracion de la app |
# Comprobar el entorno

Despues de haber encendido o el appinya-db en solitario o ejecutar el Docker-Compose, como se que esta funcionando el backend?



En un principio muy facil, yo utilizo Postman para comprobarlo pero podeis utilizar cualquier herramienta. 
Primero de todo validar que hay conexion con el backend
1. Hacer Login.
En curl: 
```
curl --location --request POST 'http://localhost:61775/Users/authenticate' \
--data-raw '{'\''Username'\'':'\''admin'\'','\''Password'\'':'\''admin'\''}'
```
En Postman: 
```
GET http://localhost:8081/api/v1.0/autenticacio/validar
Content-Type application/json
Body 
{
  "Usuari": "admin@appinya.com",
  "Contrasenya": 12345678
}
```
y devolvera lo siguiente: 
```
{
    "Id": "admin@appinya.com",
    "Usuari": "admin@appinya.com",
    "Nom": "admin@appinya.com",
    "Cognoms": null,
    "Email": "admin@appinya.com",
    "Contrasenya": null,
    "Rols": [
        "CASTELLER",
        "ADMIN"
    ],
    "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW5AYXBwaW55YS5jb20iLCJyb2xlIjpbIkNBU1RFTExFUiIsIkFETUlOIl0sIm5iZiI6MTY2OTgxOTE5MCwiZXhwIjoxNjcyNDExMTkwLCJpYXQiOjE2Njk4MTkxOTB9.XgrcpxW8iaQrP2nqbeIsWgsQM3PDz0zEjxzzNlNwQHg",
    "RefreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW5AYXBwaW55YS5jb20iLCJyb2xlIjoiUkVGUkVTSF9UT0tFTiIsIm5iZiI6MTY2OTgxOTE5MCwiZXhwIjoxNjc1MDAzMTkwLCJpYXQiOjE2Njk4MTkxOTB9.xlqJTdBSbynsg_JnxR5S4-CGk-tvBkEoR1MdjESF6-g",
    "ConfirmatEmail": true
}
``` 
Cojer el Token.
1. Ejecutar les siguente consultes
En Postman: 
```
POST http://localhost:8081/api/v1.0/autenticacio/usuari
Content-Type application/json
Body 
{
  "Usuari": "test_412@test.com",
  "Contrasenya": "•••••••"
}
```

```
POST http://localhost:8081/api/v1.0/usuari/rols/assignar
Content-Type application/json
Body  
{
  "Email": "{{random_usuari}}",
  "Rols": [
    "ADMIN"
  ]
}
```
ya tienes un usuario admin en la App! :D ..... 

# Como crear el primer usuario
Ahora que tenemos el backend funcionando, necesitaremos crear el primer usuario de la app como admin.

Para estos casos la aplicación tiene un usuario en el fichero de configuración para hacer esta primera acción.

En el fichero appsettings.json existen los siguientes usuarios de prueba:
``` 
{
  "ConnectionStrings": {
   .... 
  },
  "AppSettings": {
    "UsuariAdmin": "admin@appinya.com",
    "PasswordAdmin": "12345678",
    "UsuariTest": "test@appinya.com",
    "PasswordTest": "12345678"
```
Para crear un Casteller, se debe utilizar una petición CURL ( Podeis hacerla con Postman ;) 
1. Os logineais para extraer el token de autenticación
```
curl --location 'http://localhost:8081/api/v1.0/autenticacio/validar' \
--header 'Content-Type: application/json' \
--data-raw '{"Usuari":"admin@appinya.com","Contrasenya":"12345678"}'
```
y del resultado de la peticion coger el Token
```
{
    "Id": "xxx-2e6d-4da5-8c4a-xxxx",
    "Usuari": "admin@appinya.com",
    "Nom": "admin@appinya.com",
    "Cognoms": null,
    "Email": "admin@appinya.com",
    "Contrasenya": null,
    "Rols": [
        "CASTELLER",
        "ADMIN"
    ],
    "Token": "xxxx.xxx.xx-xx",
    "RefreshToken": "xxxx.xx.xx",
    "ConfirmatEmail": true
}
```
1. Siguiente peticion es la creacion del casteller con el token

curl --location --request PUT 'http://localhost:8081/api/v1.0/castellers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer EL_TOKEN_AQUI' \
--data-raw '{ 
 "Nom":"Test",
 "Cognom":"Test",
 "Alias":"skanciado",
 "Email":"skanciado@outlook.com",         
 "IdTipusDocument":1, 
 "Document":"46555555S",
 "Telefon1":"933030243",
 "VisTelefon1":false,
 "Telefon2":"6666666",
 "VisTelefon2":false,
 "Carrec":"Tester",
 "Direccio":"Antoni Willifox 1111",        
 "CodiPostal":"08018",
"IdMunicipi":147463,
"IdProvincia":86,  
 "VisDireccio":false,
 "Assegurat":false,
 "DataNaixement":"1980-12-30T00:00:00",
 "VisDataNaixement":false,
 "TeCamisa":false,  
 "Sanitari":false,
 "Habitual":false,
 "Actiu":true,
 "RebreCorreuNoticies":false,
 "RebreCorreuFotos":false, 
 "TeCasc":false,
 "EsCascLloguer":false
 }'
 ```

Dependiendo que tengas el parametro EmailEnabled y el correo configurado os enviara un correo con la nueva contraseña, En caso contrario debeis ver la traza del backend (dentro del Pod) y buscar algo parecido a esto:

```
ppinyaServerCore.Services.UsuariService: Information:  WARNING: Creació d'usuari skanciado@outlook.com amb password Appinya.1935282
```

# Soporte
Cualquier duda o mejora o si necesitais soporte enviarme un correo a skanciado@gmail.com.

Gracias.


