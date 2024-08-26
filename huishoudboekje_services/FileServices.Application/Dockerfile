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
COPY ["FileServices.Application/FileServices.Application.csproj", "FileServices.Application/"]
RUN dotnet restore "FileServices.Application/FileServices.Application.csproj"
COPY . .
WORKDIR "/src/FileServices.Application"
RUN dotnet build "FileServices.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS efbundle
WORKDIR "/src/FileServices.Domain"
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet-ef migrations bundle --self-contained -r linux-x64  --msbuildprojectextensionspath _intermediate_


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "FileServices.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=efbundle ./src/FileServices.Domain/efbundle ./migrations/
COPY ["FileServices.Application/appsettings.json", "./migrations/"]
COPY execute-migrations.sh .
RUN chmod 755 ./migrations/efbundle
RUN chmod 755 ./execute-migrations.sh
ENTRYPOINT ["dotnet", "FileServices.Application.dll", "--launch-profile production"]
