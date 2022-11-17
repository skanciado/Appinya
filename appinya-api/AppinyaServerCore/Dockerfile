ARG enviroment 
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /App
EXPOSE 80
ENV ASPNETCORE_ENVIRONMENT=$enviroment
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src 
COPY . .
WORKDIR /src
RUN ls   -alh
RUN dotnet restore 

FROM build AS publish
RUN dotnet publish  -c Release -o /App/publish
WORKDIR /App/publish
RUN ls   -alh

FROM base AS final
WORKDIR /App
COPY --from=build /src .
COPY --from=publish /App/publish .
RUN ls   -alh
ENTRYPOINT ["dotnet", "AppinyaServerCore.dll"]