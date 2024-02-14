#!/bin/bash

# Start port forwarding
kubectl port-forward deployment/hhb-database 5432:5432 --namespace=$NAMESPACE &
forwarding_pid=$!

# Task you want to perform while port forwarding is active
echo "Performing some task..."
npm ci
npm start & 
npx cypress run --env baseUrl=$APP_HOST,

# Stop port forwarding
kill $forwarding_pid
wait $forwarding_pid 2>/dev/null
echo "Port forwarding stopped."
