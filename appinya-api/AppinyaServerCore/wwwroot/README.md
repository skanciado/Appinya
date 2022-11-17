Appinya	*
Pre-requisitos.

Instalar Visual Studio 2017 1.1) Descargar en Tools > Actualitzaciones i extesiones las siguientes extensiones (NPM Task , TypeScript Editor , WebPack Task)
Instalar nodeJs (comprovar la instalacion con la linea de comnados npm -version)
Instalar SQL Server Express 2017
Abrir linea de comandos i realizar las siguientes acciones: 4.1) npm bower -g install 4.2) npm angular-cli -g install 4.3) npm apache -g install 4.4) npm install -g cordova ionic 4.5) npm install -g npm-cli 4.6) install gradle https://gradle.org/install 
Ir Control Panel\Programs\Programs and Features i seleccionar Turn Windows features on or off e installar Internet Information Server On! (Nota: Activar Development> ASP 4.5)
Ir a Visual Studio a Options>Project and Solutions> Web Package Management > External Tools i positionar la variable ($PATH) en la segunda posicion. (nota: Reiniciar Visual Studio)
Ir a Visual Studio NPM Task Manager, cambiar al proyecto ApppinyaMobileClient , ejecutar la tarea install i la tarea build
Actualizar las SDK de android en el Studio de Android
Virtual Emulator de Microsoft instalar la versiones que quieras
Manual de Inicialización de la instalacion

Ejecutar el Script de inicialilizacion de la DataBase AppinyaServer*.sql

Ejecutar la Solucion Appinya en el Visual Studio.

Ir a la Solucion > Propiedades > Web , seleccionar Local IIS i presionar Crear Directorio (Nota: Run VS as administrator)

Ir al IIS , Activar el Application Pool de ASP 4.5 a la aplicacion Appinya

Crear un usuario IISUser en Administrative Tools con permisos de administrador

Asignar el usuario IISUser al ApplicationPool (reiniciar)

Ir al Sql Manager Studio y crear una credencial en Segurity > Users con el usuario IISUser, (Nota: Recuerda aplicarle permisos al usuario a la DB)

Enjoy.
