Comienza a trabajar con Appinya
=============================

- [Como funciona?](#como-funciona)
- [Soy de Front, que hago?](#soy-de-front-que-hago)
- [Entorno Desarrollo Back](#entorno-desarrollo-back)
- [Soporte](#Soporte)
 
# Como Funciona
El proyecto Appinya es un proyecto de codigo abierto compuesto por dos proyectos distintos.
* **Parte Servidora** Este parte servidora es la responsable de almacenar y gestionar la información de la colla. Esta parte se comunica con un servidor de base de datos.
 :page_facing_up: [Link Repo](https://gitlab.com/appinya/appinya-api)
* **Parte Cliente**. La parte cliente es la responsable de mostrar la información de la parte servidora. 
:page_facing_up: [Link Repo](https://gitlab.com/appinya/appinya-api)

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
    "UsuariAdmin": "skanciado@gmail.com",
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
1. Recordar cambiar los conectionsStrings del fichero appsettings.json o crear uno nuevo.

# Soporte
Qualquier duda o mejora o si necesitais soporte enviarme un correo a skanciado@gmail.com.

Gracias.



