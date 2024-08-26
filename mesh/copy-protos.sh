#!/bin/bash

set -e

#Logservice
mkdir -p protos/logservice
cp -r ../huishoudboekje_services/LogService.Grpc/Protos/* ./protos/logservice/

#Alarmservice
mkdir -p protos/alarmservice
cp -r ../huishoudboekje_services/AlarmService.Grpc/Protos/* ./protos/alarmservice/

#Bankservice
mkdir -p protos/bankservice
cp -r ../huishoudboekje_services/BankServices.Grpc/Protos/* ./protos/bankservice/

echo "Copied proto files"
