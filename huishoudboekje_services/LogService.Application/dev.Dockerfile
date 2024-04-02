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
ENV HHB_DATABASE_URL "Host=db;Database=logservice;Port=5432;Username=postgres;Password=postgres"
WORKDIR /app
COPY ./LogService.Domain/Migrations/Scripts/ ./LogService.Application/Migrations/Scripts/
COPY . .
#RUN dotnet restore ./LogService*/*.csproj
ENTRYPOINT dotnet watch run --urls=http://+:8000 --project LogService*/*.csproj --verbose
