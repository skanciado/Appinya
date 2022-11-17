
Comienza a trabajar con Appinya
=============================

- [Como funciona?](#como-funciona)
- [Soy de Front, que hago?](#soy-de-front-que-hago)
- [Entorno Desarrollo](#entorno-desarrollo)

# Como Funciona
El proyecto Appinya es un proyecto de codigo abierto compuesto por dos proyectos distintos.
* **Parte Servidora** Este parte servidora es la responsable de almacenar y gestionar la información de la colla. Esta parte se comunica con un servidor de base de datos.
 :page_facing_up: [Link Repo](https://gitlab.com/appinya/appinya-api)
* **Parte Cliente**. La parte cliente es la responsable de mostrar la información de la parte servidora. 
:page_facing_up: [Link Repo](https://gitlab.com/appinya/appinya-api)

# Soy de Front, que hago?
Este proyecto esta en dos proyectos, uno basado en tecnologías Front (HTML, CSS ,TS,JS,IONIC , ...) y otro en tecnolías Back (NetCore , SQL Server).

Para facilitar la vida a los programadores front se ha diseñado un **docker compose** para poder ejecutar el backend sin necesidad de tener el entorno de desarrollo de back instalado.



# Entorno Desarrollo

Para poder desarroll

** Pre-requisits. **
1. Instal.lar Visual Studio 2019
1. Instal.lar Sql Manager Studio
1. Anar a Visualt Studio, i descarregar Tools > Actualitzaciones i extesiones las siguientes extensiones (NPM Task) 
1. Instal.lar SQL Server Express 2017 
1. Anar a Control Panel\Programs\Programs and Features i seleccionar Turn Windows features on or off e installar Internet Information Server On!  (Nota: Activar Development> ASP 4.5)


** Manual de Inicializació de la instalació **

1. Executar els Script de inicialilizació de la base de dades,  AppinyaServer\App_data\*.sql 
1. Obre la Solució Appinya en el Visual Studio. 
1. Anar al IIS , Activar el Application Pool de ASP 4.5 a la aplicació Appinya 
1. Assignar el usuari IISUser al ApplicationPool (reiniciar)
1. Anar al Sql Manager Studio i crear una credencial en Segurity > Users con el usuario IISUser, (Nota: Recorda aplicar els permisos de l'usuario a la DB)
1. Enjoy.


