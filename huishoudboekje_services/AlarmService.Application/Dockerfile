FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
#AUTH ENV VARIABLES
ENV HHB_JWT_ALLOWED_ALGORITHMS "HS256,RS256"
ENV HHB_USE_AUTH "1"

EXPOSE 8000
EXPOSE 9000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["AlarmService.Application/AlarmService.Application.csproj", "AlarmService.Application/"]
RUN dotnet restore "AlarmService.Application/AlarmService.Application.csproj"
COPY . .
WORKDIR "/src/AlarmService.Application"
RUN dotnet build "AlarmService.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "AlarmService.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AlarmService.Application.dll", "--launch-profile production"]
