FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 9000
EXPOSE 8000

ENV HHB_JWT_ALLOWED_ALGORITHMS "HS256,RS256"
ENV HHB_USE_AUTH "1"

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NotificationService.Application/NotificationService.Application.csproj", "NotificationService.Application/"]
RUN dotnet restore "NotificationService.Application/NotificationService.Application.csproj"
COPY . .
WORKDIR "/src/NotificationService.Application"
RUN dotnet build "NotificationService.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "NotificationService.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.Application.dll", "--launch-profile production"]
