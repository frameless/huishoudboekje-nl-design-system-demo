#!/bin/bash

# Start port forwarding
kubectl port-forward service/hhb-database 5432:5432 -v=8 --streaming-connection-idle-timeout=0 --namespace=$NAMESPACE &
forwarding_pid=$!

#running cypress tests
echo "Installing..."
npm ci
echo "Executing tests..."
npx cypress run --config baseUrl=$APP_HOST
cypress_exit_code=$?

# Stop port forwarding
kill $forwarding_pid
wait $forwarding_pid 2>/dev/null
echo "Port forwarding stopped."

# Exit with the exit code of Cypress tests
exit $cypress_exit_code