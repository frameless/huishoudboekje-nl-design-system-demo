#!/bin/bash

# Start port forwarding
kubectl port-forward deployment/hhb-database 5432:5432 -v=8 --namespace=$NAMESPACE &
forwarding_pid=$!

apt update
apt install net-tools telnet

sleep 10

netstat -f

telnet localhost 5432

#running cypress tests
# echo "Installing..."
# npm ci
# echo "Executing tests..."
# npx cypress run --config baseUrl=$APP_HOST
# cypress_exit_code=$?

# # Stop port forwarding
# kill $forwarding_pid
# wait $forwarding_pid 2>/dev/null
# echo "Port forwarding stopped."

# # Exit with the exit code of Cypress tests
# exit $cypress_exit_code