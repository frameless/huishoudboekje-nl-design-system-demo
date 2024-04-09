FROM mcr.microsoft.com/dotnet/sdk:8.0
EXPOSE 8000
EXPOSE 9000

ENV HHB_RABBITMQ_HOST "rabbitmq"
ENV HHB_RABBITMQ_PORT "5672"
ENV HHB_RABBITMQ_USER "guest"
ENV HHB_RABBITMQ_PASS "guest"
ENV HHB_USE_AUTH "0"
ENV HHB_RAPPORTAGE_SERVICE "http://rapportageservice:8000"
ENV HHB_HUISHOUDBOEKJE_SERVICE "http://huishoudboekjeservice:8000"
WORKDIR /app
COPY . .
RUN dotnet restore ./UserApi.Application/UserApi.Application.csproj
ENTRYPOINT dotnet run --urls=http://+:8000 --project ./UserApi.Application/UserApi.Application.csproj --launch-profile dev-docker --no-restore
