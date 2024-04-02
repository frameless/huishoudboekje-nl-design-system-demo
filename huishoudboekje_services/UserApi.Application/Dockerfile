FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
ENV HHB_HUISHOUDBOEKJE_SERVICE_URL = "huishoudboekjeservice:8000"

EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["UserService.Application/UserService.Application.csproj", "UserService.Application/"]
RUN dotnet restore "UserService.Application/UserService.Application.csproj"
COPY . .
WORKDIR "/src/UserService.Application"
RUN dotnet build "UserService.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "UserService.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserService.Application.dll"]
