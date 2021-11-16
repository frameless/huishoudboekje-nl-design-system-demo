#!/bin/bash

set -e

# Use the provided NAMESPACE or "huishoudboekje" as the default.
export NAMESPACE=${NAMESPACE:-huishoudboekje}
export DEPLOYMENT_DIST_DIR="dist"

kubectl apply -f k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file.yaml --namespace=$NAMESPACE
helm repo add bitnami "https://charts.bitnami.com/bitnami"
helm repo update
helm dependency build helm/contactcatalogus
helm upgrade hhb-contactcatalogus helm/contactcatalogus --install --namespace=$NAMESPACE --set settings.env=prod --set settings.debug=0 --set settings.cache=1
sleep 30 # Todo: We use this to wait for the contactcatalogus to be running, 30 seconds can be too long or too short. We should actually run some check that waits until it is up.
kubectl exec $(kubectl get pods -l app.kubernetes.io/instance=hhb-contactcatalogus -n $NAMESPACE | grep php | cut -d' ' -f1 | head -n1) --namespace=$NAMESPACE -- bin/console doctrine:schema:update -f
