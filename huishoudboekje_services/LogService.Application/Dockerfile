FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
#AUTH ENV VARIABLES
ENV HHB_JWT_ALLOWED_ALGORITHMS "HS256,RS256"
ENV HHB_USE_AUTH "1"

EXPOSE 8000
EXPOSE 9000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LogService.Application/LogService.Application.csproj", "LogService.Application/"]
RUN dotnet restore "LogService.Application/LogService.Application.csproj"
COPY . .
WORKDIR "/src/LogService.Application"
RUN dotnet build "LogService.Application.csproj" -c Release -o /app/build

FROM build AS efbundle
WORKDIR "/src/LogService.Domain"
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet-ef migrations bundle --self-contained -r linux-x64  --msbuildprojectextensionspath _intermediate_

FROM build AS publish
RUN dotnet publish "LogService.Application.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR src/app
COPY ./LogService.Domain/Migrations/Scripts/ ./LogService.Application/Migrations/Scripts/
COPY --from=publish /app/publish .
COPY --from=efbundle ./src/LogService.Domain/efbundle ./migrations/
COPY ["LogService.Application/appsettings.json", "./migrations/"]
COPY execute-migrations.sh .
RUN chmod 755 ./migrations/efbundle
RUN chmod 755 ./execute-migrations.sh
CMD ["dotnet", "LogService.Application.dll", "--launch-profile production"]
