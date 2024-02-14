#!/bin/bash

# Start port forwarding
kubectl port-forward deployment/hhb-database 5432:5432 --namespace=$NAMESPACE &
forwarding_pid=$!

echo "Installing..."
npm ci

echo "Executing tests..."
npx cypress run --env baseUrl=$APP_HOST,

# Stop port forwarding
kill $forwarding_pid
wait $forwarding_pid 2>/dev/null
echo "Port forwarding stopped."
