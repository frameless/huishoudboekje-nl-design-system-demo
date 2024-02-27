#!/bin/bash

cleanup() {
    echo "Deleting temporary database mesh ingress..."
    kubectl delete -f cypress/pipeline/database-mesh-ingress.yaml  --namespace=$NAMESPACE
}
trap cleanup EXIT

echo "Applying envvars..."
envsubst < cypress/pipeline/sample.database-mesh-ingress.yaml > cypress/pipeline/database-mesh-ingress.yaml

echo "Adding temporary database mesh ingress"
kubectl apply -f cypress/pipeline/database-mesh-ingress.yaml --namespace=$NAMESPACE
sleep 30

echo "Installing npm packages..."
npm ci

echo "Executing tests..."
npx cypress run --config baseUrl=$APP_HOST --env graphqlUrl=$DATABASE_HOST,aad_username=$TEST_USER_ONE_EMAIL,aad_password=$TEST_USER_ONE_PASSWORD --record --key $CYPRESS_KEY





