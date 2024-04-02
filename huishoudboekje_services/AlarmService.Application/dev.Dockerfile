FROM mcr.microsoft.com/dotnet/sdk:8.0
EXPOSE 8000
EXPOSE 9000
ENV DOTNET_USE_POLLING_FILE_WATCHER 1
#RABBITMQ ENV VARIABLES
ENV HHB_RABBITMQ_HOST "rabbitmq"
ENV HHB_RABBITMQ_PORT "5672"
ENV HHB_RABBITMQ_USER "guest"
ENV HHB_RABBITMQ_PASS "guest"

#AUTH ENV VARIABLES
ENV HHB_JWT_ALLOWED_ALGORITHMS "HS256,RS256"
ENV HHB_USE_AUTH "0"
ENV HHB_JWT_ISSUER "local"
ENV HHB_JWT_AUDIENCE "local"
ENV HHB_JWT_SECRET "local"

#DATABSE ENV VARIABLES
ENV HHB_DATABASE_URL "Host=db;Database=alarmenservice;Port=5432;Username=postgres;Password=postgres"
ENV HHB_RAPPORTAGE_SERVICE "http://rapportageservice:8000"
ENV HHB_HUISHOUDBOEKJE_SERVICE "http://huishoudboekjeservice:8000"
WORKDIR /app
COPY . .
RUN dotnet restore ./AlarmService.Application/AlarmService.Application.csproj
ENTRYPOINT dotnet run --urls=http://+:8000 --project ./AlarmService.Application/AlarmService.Application.csproj --launch-profile dev-docker --no-restore
