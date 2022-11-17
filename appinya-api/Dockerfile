
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /App
EXPOSE 80
 

#Building block
FROM mcr.microsoft.com/dotnet/sdk:6.0.201 AS build
WORKDIR /src 
COPY . . 
WORKDIR /src/AppinyaServerCore #Cambiar el directorio de trabajo al projecto principal
RUN dotnet restore 
# RUN ls   -alh
#Publish block
FROM build AS publish
RUN dotnet publish  -c Release -o /App/publish
WORKDIR /App/publish
# RUN ls   -alh

# Imagen Final
FROM base AS final
WORKDIR /App # Directorio Base
COPY --from=build /src/AppinyaServerCore/appsettings.Docker.json appsettings.json # Copiamos fichero appsettings de docker
COPY --from=build /src/AppinyaServerCore/appsettings.Docker.json appsettings.Docker.json
COPY --from=publish /App/publish . #y todo lo generado en el la fase de publicacion 
# RUN ls   -alh
ENTRYPOINT ["dotnet", "AppinyaServerCore.dll"]