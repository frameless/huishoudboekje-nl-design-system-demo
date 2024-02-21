#!/bin/bash


# POD_NAME=$(kubectl get pods --selector=name=hhb-database --output=jsonpath='{.items[*].metadata.name}' --namespace=$NAMESPACE)

# kubectl port-forward --address 0.0.0.0 deployment/hhb-database 5432:5432 -v=8 --namespace=$NAMESPACE &
# forwarding_pid=$!


# apt update
# apt install -y postgresql-client

# curl -v telnet://127.0.0.1:5432


# kubectl get pods $POD_NAME -o jsonpath='{.spec.containers[*].name}' --namespace=$NAMESPACE

# echo "pod..  {$POD_NAME}."
# echo "copy..."

# kubectl cp ./cypress/scripts/execute_query.sh $POD_NAME:/tmp/execute_query.sh --namespace=$NAMESPACE

# echo "exec..."

# kubectl exec -it $POD_NAME -- bash /tmp/execute_query.sh "SELECT * FROM "Alarm";" --namespace=$NAMESPACE
# echo "done..."

# Start port forwarding
# kubectl port-forward  deployment/hhb-database 5432:5432 -v=8 --namespace=$NAMESPACE &
# forwarding_pid=$!

# sleep 5


# echo "ss"
# ss -tnl

# # running cypress tests
# echo "Installing..."
# echo "Executing tests..."
# npx cypress run --config baseUrl=$APP_HOST
# cypress_exit_code=$?

# # Stop port forwarding
# kill $forwarding_pid
# wait $forwarding_pid 2>/dev/null
# echo "Port forwarding stopped."

# # Exit with the exit code of Cypress tests
# exit $cypress_exit_code

export PUBLIC_IP=$(curl -s ifconfig.me)

echo "Applying envvars."
envsubst < cypress/scripts/sample.extra-database-service.yaml > cypress/scripts/extra-database-service.yaml

echo "Adding temporary database ingress"
kubectl apply -f cypress/scripts/extra-database-service.yaml  --namespace=$NAMESPACE
sleep 5

echo "Getting db host..."
DATABASE_HOST=$(kubectl get svc hhb-database-public-service -o=jsonpath='{.status.loadBalancer.ingress[0].ip}')


echo "Executing"
psql -h ${DATABASE_HOST} -U postgres -d alarmenservice -c "SELECT * FROM \"Alarm\";"
sleep 5

echo "Deleting temporary database ingress"
kubectl delete -f cypress/scripts/extra-database-service.yaml  --namespace=$NAMESPACE