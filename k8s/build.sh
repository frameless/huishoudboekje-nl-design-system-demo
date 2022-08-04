#!/bin/bash

set -e

# Take the name of the current branch and the short hash of the current commit
# either from CI_COMMIT_REF_SLUG and CI_COMMIT_SHORT_SHA, or from git.
BRANCH_NAME=${CI_COMMIT_REF_SLUG:-$(git rev-parse --abbrev-ref HEAD)}
BRANCH_NAME=${BRANCH_NAME//_/-}
COMMIT_SHA=${CI_COMMIT_SHORT_SHA:-$(git rev-parse --short HEAD)}

# If we use BRANCH_NAME and COMMIT_SHA as the IMAGE_TAG, you can override this by providing IMAGE_TAG.
export IMAGE_TAG=${IMAGE_TAG:-$BRANCH_NAME-$COMMIT_SHA}

# The registry in which the images for the application are stored.
export IMAGE_REGISTRY="registry.gitlab.com/commonground/huishoudboekje/app-new"

# Use the provided NAMESPACE or "huishoudboekje" as the default namespace.
export NAMESPACE=${NAMESPACE:-"huishoudboekje"}

# Use the provided APP_HOST or "huishoudboekje.example.com" as the default.
export APP_HOST=${APP_HOST:-"huishoudboekje.example.com"}

# Audience that is used for JWTs.
export AUTH_AUDIENCE=${AUTH_AUDIENCE:-$APP_HOST}

# Secret that is used for JWTs.
export HHB_SECRET=${SECRET_KEY:-"test"}

# Database hostname
export POSTGRESQL_HOSTNAME="hhb-database"
export POSTGRESQL_PORT="5432"

# Database names
export POSTGRESQL_DATABASE="postgres"
export POSTGRESQL_DATABASE_NAME_BKTSVC="banktransactieservice"
export POSTGRESQL_DATABASE_NAME_GRBSVC="grootboekservice"
export POSTGRESQL_DATABASE_NAME_HHBSVC="huishoudboekjeservice"
export POSTGRESQL_DATABASE_NAME_LOGSVC="logservice"
export POSTGRESQL_DATABASE_NAME_ORGSVC="organisatieservice"
export POSTGRESQL_DATABASE_NAME_PADSVC="postadressenservice"
export POSTGRESQL_DATABASE_NAME_ALMSVC="alarmenservice"
export POSTGRESQL_DATABASE_NAME_SIGSVC="signalenservice"

# Database usernames
export POSTGRESQL_USERNAME="postgres"
export POSTGRESQL_USERNAME_BKTSVC="bktsvc"
export POSTGRESQL_USERNAME_GRBSVC="grbsvc"
export POSTGRESQL_USERNAME_HHBSVC="hhbsvc"
export POSTGRESQL_USERNAME_LOGSVC="logsvc"
export POSTGRESQL_USERNAME_ORGSVC="orgsvc"
export POSTGRESQL_USERNAME_PADSVC="padsvc"
export POSTGRESQL_USERNAME_ALMSVC="almsvc"
export POSTGRESQL_USERNAME_SIGSVC="sigsvc"

# Passwords for databases
export POSTGRESQL_PASSWORD="postgres"
export POSTGRESQL_PASSWORD_BKTSVC="bktsvc"
export POSTGRESQL_PASSWORD_GRBSVC="grbsvc"
export POSTGRESQL_PASSWORD_HHBSVC="hhbsvc"
export POSTGRESQL_PASSWORD_LOGSVC="logsvc"
export POSTGRESQL_PASSWORD_ORGSVC="orgsvc"
export POSTGRESQL_PASSWORD_PADSVC="padsvc"
export POSTGRESQL_PASSWORD_ALMSVC="almsvc"
export POSTGRESQL_PASSWORD_SIGSVC="sigsvc"

# Unleash OTAP stage
export UNLEASH_OTAP=${UNLEASH_OTAP:-"production"}

# OIDC Settings
export OIDC_ISSUER_URL=${OIDC_ISSUER_URL:-"https://keycloak.huishoudboekje.demoground.nl/realms/huishoudboekje"}
export OIDC_CLIENT_ID=${OIDC_CLIENT_ID:-"huishoudboekje-medewerkers"}
export OIDC_CLIENT_SECRET=${OIDC_CLIENT_SECRET:-"this should come from a secret envvar"}
export OIDC_BASE_URL=${OIDC_BASE_URL:-$HHB_APP_HOST}
export JWT_ISSUER=${JWT_ISSUER:-$HHB_APP_HOST}
export JWT_AUDIENCE=${JWT_AUDIENCE:-$HHB_APP_HOST}
export JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-"30d"}
export JWT_SECRET=${JWT_SECRET:-"this should come from a secret envvar"}

# if this is 1, we use the Let's Encrypt annotation in Ingresses
export USE_LETSENCRYPT=${USE_LETSENCRYPT:-0}

# Create a temporary directory to put the dist files in.
export DEPLOYMENT_DIST_DIR="dist"

# Debugging
echo CI_COMMIT_REF_SLUG = $CI_COMMIT_REF_SLUG
echo CI_COMMIT_SHORT_SHA = $CI_COMMIT_SHORT_SHA
echo BRANCH_NAME = $BRANCH_NAME
echo COMMIT_SHA = $COMMIT_SHA
echo IMAGE_TAG = $IMAGE_TAG
echo NAMESPACE = $NAMESPACE
echo APP_HOST = $APP_HOST
echo DEPLOYMENT_DIST_DIR = $DEPLOYMENT_DIST_DIR

# Create directory to store the dist files for the deployment in
mkdir -p k8s/$DEPLOYMENT_DIST_DIR

echo "Generate kustomization.yaml"
cd k8s/$DEPLOYMENT_DIST_DIR

# Create final kustomization.yaml
cat << EOF > kustomization.yaml
---
# generated yaml file
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

patchesStrategicMerge:
EOF

if [ $USE_LETSENCRYPT == 1 ]; then
  echo "Adding patches that adds the letsencrypt annotation and TLS configuration..."
  cp ../overlay/patches/use-letsencrypt/ingress-patches.yaml patch_letsencrypt.yaml
  echo "- patch_letsencrypt.yaml" >> kustomization.yaml
fi

echo "Generate secrets.yaml and add as resource"
envsubst < ../templates/secrets.yaml > secrets.yaml
kustomize edit add resource secrets.yaml

echo "Add default overlay as resource"
kustomize edit add resource ../overlay/default

echo "Set images"
kustomize edit set image backend=${IMAGE_REGISTRY}/backend:${IMAGE_TAG}
kustomize edit set image backendburgers=${IMAGE_REGISTRY}/backendburgers:${IMAGE_TAG}
kustomize edit set image banktransactieservice=${IMAGE_REGISTRY}/banktransactieservice:${IMAGE_TAG}
kustomize edit set image frontend=${IMAGE_REGISTRY}/frontend:${IMAGE_TAG}
kustomize edit set image grootboekservice=${IMAGE_REGISTRY}/grootboekservice:${IMAGE_TAG}
kustomize edit set image huishoudboekjeservice=${IMAGE_REGISTRY}/huishoudboekjeservice:${IMAGE_TAG}
kustomize edit set image logservice=${IMAGE_REGISTRY}/logservice:${IMAGE_TAG}
kustomize edit set image organisatieservice=${IMAGE_REGISTRY}/organisatieservice:${IMAGE_TAG}
kustomize edit set image unleashservice=${IMAGE_REGISTRY}/unleashservice:${IMAGE_TAG}
kustomize edit set image postadressenservice=${IMAGE_REGISTRY}/postadressenservice:${IMAGE_TAG}
kustomize edit set image alarmenservice=${IMAGE_REGISTRY}/alarmenservice:${IMAGE_TAG}
kustomize edit set image signalenservice=${IMAGE_REGISTRY}/signalenservice:${IMAGE_TAG}
kustomize edit set image authservice=${IMAGE_REGISTRY}/authservice:${IMAGE_TAG}
kustomize edit set image storybook=${IMAGE_REGISTRY}/storybook:${IMAGE_TAG}

cd ../../
echo "Building Kustomize..."
kustomize build k8s/$DEPLOYMENT_DIST_DIR > k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file_.yaml

echo "Applying envvars and create namespace.yaml"
envsubst < k8s/namespace.yaml > k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml
envsubst < k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file_.yaml > k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file.yaml
rm -rf k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file_.yaml

echo "You will find your files in $DEPLOYMENT_DIST_DIR."
echo "Create a namespace if it doesn't exist yet 'kubectl apply -f k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml'"
echo "To deploy, run 'sh k8s/deploy.sh'"
