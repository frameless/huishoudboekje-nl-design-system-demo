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

cleanup() {
    echo "Deleting temporary database mesh ingress..."
    kubectl delete -f cypress/scripts/database-mesh-ingress.yaml  --namespace=$NAMESPACE
}
trap cleanup EXIT

echo "Getting runner public ip..."
export PUBLIC_IP=$(curl -s ifconfig.me)

echo "Applying envvars..."
envsubst < cypress/scripts/sample.database-mesh-ingress.yaml > cypress/scripts/database-mesh-ingress.yaml

echo "Adding temporary database mesh ingress"
kubectl apply -f cypress/scripts/database-mesh-ingress.yaml --namespace=$NAMESPACE
sleep 30

# echo "Installing..."
# npm ci

# echo "Executing tests..."
# npx cypress run --config baseUrl=$APP_HOST

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation CreateAlarm { createAlarm(input: { alarm: { afspraakId: 12, id: \"testfrompipeline\", isActive: false, datumMargin: 20, bedrag: 1230, bedragMargin: 5, startDate: \"20-12-2023\" } }) { id isActive startDate }}" }' \
  $DATABASE_HOST/graphql




