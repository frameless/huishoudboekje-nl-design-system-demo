#!/bin/bash

apt update
apt install python3
apt install python3-pip

pip install psycopg2

# Start port forwarding
kubectl port-forward deployment/hhb-database 5432:5432 --namespace=$NAMESPACE &
forwarding_pid=$!

sleep 5

python3 cypress/scripts/test.py

#running cypress tests
# echo "Executing tests..."
# npx cypress run --config baseUrl=$APP_HOST
# cypress_exit_code=$?

# Stop port forwarding
kill $forwarding_pid
wait $forwarding_pid 2>/dev/null
echo "Port forwarding stopped."

# Exit with the exit code of Cypress tests
exit $cypress_exit_code