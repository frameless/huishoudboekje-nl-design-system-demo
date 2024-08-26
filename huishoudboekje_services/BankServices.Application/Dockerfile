FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
#AUTH ENV VARIABLES
ENV HHB_JWT_ALLOWED_ALGORITHMS "HS256,RS256"
ENV HHB_USE_AUTH "1"

EXPOSE 8080
EXPOSE 9000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["BankServices.Application/BankServices.Application.csproj", "BankServices.Application/"]
RUN dotnet restore "BankServices.Application/BankServices.Application.csproj"
COPY . .
WORKDIR "/src/BankServices.Application"
RUN dotnet build "BankServices.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS efbundle
WORKDIR "/src/BankServices.Domain"
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet-ef migrations bundle --self-contained -r linux-x64  --msbuildprojectextensionspath _intermediate_

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "BankServices.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=efbundle ./src/BankServices.Domain/efbundle ./migrations/
COPY ["BankServices.Application/appsettings.json", "./migrations/"]
COPY execute-migrations.sh .
RUN chmod 755 ./migrations/efbundle
RUN chmod 755 ./execute-migrations.sh
ENTRYPOINT ["dotnet", "BankServices.Application.dll", "--launch-profile production"]
