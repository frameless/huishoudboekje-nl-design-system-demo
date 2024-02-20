#!/bin/bash

# Start port forwarding
kubectl port-forward deployment/hhb-database 1234:5432  --namespace=$NAMESPACE &
forwarding_pid=$!

sleep 5

pg_isready -h localhost -p 1234

#running cypress tests
# echo "Installing..."
# echo "Executing tests..."
# npx cypress run --config baseUrl=$APP_HOST,databasePort="1234"
# cypress_exit_code=$?

# Stop port forwarding
kill $forwarding_pid
wait $forwarding_pid 2>/dev/null
echo "Port forwarding stopped."

# Exit with the exit code of Cypress tests
exit $cypress_exit_code