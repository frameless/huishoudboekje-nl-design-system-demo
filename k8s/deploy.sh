#!/bin/bash

set -e

# Use the provided NAMESPACE or "huishoudboekje" as the default.
export NAMESPACE=${NAMESPACE:-huishoudboekje}
export DEPLOYMENT_DIST_DIR="dist"

kubectl apply -f k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file.yaml --namespace=$NAMESPACE