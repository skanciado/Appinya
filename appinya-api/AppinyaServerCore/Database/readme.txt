﻿/*
 * Como integrar cambios de de la base de datos al EF del proyecto
 */
// Herramientas interessantes
1) Entity Framework Core 6.0 with EF Core Power Tools (dotnet tool install --global dotnet-ef)
2) Configurar el ODBC para actualitzar https://www.postgresql.org/ftp/odbc/versions/msi/
3) Import https://docs.microsoft.com/es-es/sql/integration-services/import-export-data/connect-to-a-postgresql-data-source-sql-server-import-and-export-wizard?view=sql-server-ver15
4) Proyecto https://github.com/ErikEJ/EFCorePowerTools/wiki 

// Como actualitzar
1) Instalar EF Tools en Nugget dotnet tool install --global dotnet-ef 
-- https://docs.microsoft.com/es-es/ef/core/cli/dotnet
2) Ejecutar sentencia 
dotnet ef dbcontext scaffold "Server=tcp:appinya-sql.database.windows.net,1433;Initial Catalog=appinyadb-pre;Persist Security Info=False;User ID=appinyamaster;Password=a9dANPV!xilZA%~w+kuM;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" Microsoft.EntityFrameworkCore.SqlServer -o Database/ -c AppinyaDbContext  -d -f 
o
dotnet ef dbcontext scaffold "Server=tcp:appinya-sql.database.windows.net,1433;Initial Catalog=appinyadb-pre;Persist Security Info=False;User ID=appinyamaster;Password=a9dANPV!xilZA%~w+kuM;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" XXXNPosgrest -o Database/ -c AppinyaDbContext  -d -f 
3) Eliminar en el contexto la cadena de conexion (si se quiere ....)