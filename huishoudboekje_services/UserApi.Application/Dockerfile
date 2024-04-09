FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
ENV HHB_USE_AUTH "1"

EXPOSE 8000
EXPOSE 9000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["UserApi.Application/UserApi.Application.csproj", "UserApi.Application/"]
RUN dotnet restore "UserApi.Application/UserApi.Application.csproj"
COPY . .
WORKDIR "/src/UserApi.Application"
RUN dotnet build "UserApi.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "UserApi.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserApi.Application.dll", "--launch-profile production"]
