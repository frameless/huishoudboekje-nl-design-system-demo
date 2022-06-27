#!/bin/bash

set -e

# Take the name of the current branch and the short hash of the current commit
# either from CI_COMMIT_REF_SLUG and CI_COMMIT_SHORT_SHA, or from git.
BRANCH_NAME=${CI_COMMIT_REF_SLUG:-$(git rev-parse --abbrev-ref HEAD)}
BRANCH_NAME=${BRANCH_NAME//_/-}
COMMIT_SHA=${CI_COMMIT_SHORT_SHA:-$(git rev-parse --short HEAD)}

# If we use BRANCH_NAME and COMMIT_SHA as the IMAGE_TAG, you can override this by providing IMAGE_TAG.
export IMAGE_TAG=${IMAGE_TAG:-${BRANCH_NAME}-$COMMIT_SHA}

# Use the provided NAMESPACE or "huishoudboekje" as the default namespace.
export NAMESPACE=${NAMESPACE:-huishoudboekje}

# Use the provided HHB_HOST or "hhb.minikube" as the default.
export HHB_HOST=${HHB_HOST:-hhb.minikube}

# Use the provided PULL_REPO_IMAGE or "registry.gitlab.com/commonground/huishoudboekje/app-new" as the default
export PULL_REPO_IMAGE=${PULL_REPO_IMAGE:-registry.gitlab.com/commonground/huishoudboekje/app-new}

# Platform to use. Options are minikube, azure_review, azure_tad, true or ocp.
export USE_PLATFORM=${USE_PLATFORM:-"true"}

# Number of pods that should be running. Default is just 1, change if you wish to scale up by default.
export DEFAULT_REPLICAS=${DEFAULT_REPLICAS:-"1"}

# Generete secrets and add to the single kustomize file. On by default.
export GENERATE_SECRETS=${GENERATE_SECRETS:-"true"}

# Choose which cert-manager you are using (Let's Encrypt by default)
export CERT_MANAGER_ISSUER=${CERT_MANAGER_ISSUER:-"letsencrypt-prod"}

# Hostname that the application will be running on.
export HHB_APP_HOST=${HHB_APP_HOST:-$HHB_HOST}

# Endpoint that the application will be running on. (Defaults to Whatever is set in $HHB_FRONTEND_DNS, don't change if you don't know what this does.)
export HHB_FRONTEND_DNS=${HHB_FRONTEND_DNS:-"$HHB_HOST"}
export HHB_FRONTEND_ENDPOINT=${HHB_FRONTEND_ENDPOINT:-"https://$HHB_FRONTEND_DNS"}

# Endpoint that the backends will be running on. (Defaults to Whatever is set in $HHB_FRONTEND_ENDPOINT, don't change if you don't know what this does.)
export HHB_API_ENDPOINT=${HHB_API_ENDPOINT:-"$HHB_FRONTEND_ENDPOINT/api"}

# Use external database
export POSTGRESQL_USE_EXTERNAL=${POSTGRESQL_USE_EXTERNAL:-"false"}
export POSTGRESQL_CREATE_DATABASES=${POSTGRESQL_CREATE_DATABASES:-"true"}

# Database hostname
export POSTGRESQL_HOSTNAME=${POSTGRESQL_HOSTNAME:-"hhb-database"}

export POSTGRESQL_PORT=${POSTGRESQL_PORT:-"5432"}

# Database names
export POSTGRESQL_DATABASE=${POSTGRESQL_DATABASE_NAME_BKTSVC:-"postgres"}
export POSTGRESQL_DATABASE_NAME_BKTSVC=${POSTGRESQL_DATABASE_NAME_BKTSVC:-"banktransactieservice"}
export POSTGRESQL_DATABASE_NAME_GRBSVC=${POSTGRESQL_DATABASE_NAME_GRBSVC:-"grootboekservice"}
export POSTGRESQL_DATABASE_NAME_HHBSVC=${POSTGRESQL_DATABASE_NAME_HHBSVC:-"huishoudboekjeservice"}
export POSTGRESQL_DATABASE_NAME_LOGSVC=${POSTGRESQL_DATABASE_NAME_LOGSVC:-"logservice"}
export POSTGRESQL_DATABASE_NAME_ORGSVC=${POSTGRESQL_DATABASE_NAME_ORGSVC:-"organisatieservice"}
export POSTGRESQL_DATABASE_NAME_PADSVC=${POSTGRESQL_DATABASE_NAME_PADSVC:-"postadressenservice"}
export POSTGRESQL_DATABASE_NAME_ALMSVC=${POSTGRESQL_DATABASE_NAME_ALMSVC:-"alarmenservice"}
export POSTGRESQL_DATABASE_NAME_SIGSVC=${POSTGRESQL_DATABASE_NAME_SIGSVC:-"signalenservice"}

# Database usernames
export POSTGRESQL_USERNAME=${POSTGRESQL_USERNAME:-"postgres"}
export POSTGRESQL_USERNAME_BKTSVC=${POSTGRESQL_USERNAME_BKTSVC:-"bktsvc"}
export POSTGRESQL_USERNAME_GRBSVC=${POSTGRESQL_USERNAME_GRBSVC:-"grbsvc"}
export POSTGRESQL_USERNAME_HHBSVC=${POSTGRESQL_USERNAME_HHBSVC:-"hhbsvc"}
export POSTGRESQL_USERNAME_LOGSVC=${POSTGRESQL_USERNAME_LOGSVC:-"logsvc"}
export POSTGRESQL_USERNAME_ORGSVC=${POSTGRESQL_USERNAME_ORGSVC:-"orgsvc"}
export POSTGRESQL_USERNAME_PADSVC=${POSTGRESQL_USERNAME_PADSVC:-"padsvc"}
export POSTGRESQL_USERNAME_ALMSVC=${POSTGRESQL_USERNAME_ALMSVC:-"almsvc"}
export POSTGRESQL_USERNAME_SIGSVC=${POSTGRESQL_USERNAME_SIGSVC:-"sigsvc"}

# Passwords for databases
export POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD:-"postgres"}
export POSTGRESQL_PASSWORD_BKTSVC=${POSTGRESQL_PASSWORD_BKTSVC:-"bktsvc"}
export POSTGRESQL_PASSWORD_GRBSVC=${POSTGRESQL_PASSWORD_GRBSVC:-"grbsvc"}
export POSTGRESQL_PASSWORD_HHBSVC=${POSTGRESQL_PASSWORD_HHBSVC:-"hhbsvc"}
export POSTGRESQL_PASSWORD_LOGSVC=${POSTGRESQL_PASSWORD_LOGSVC:-"logsvc"}
export POSTGRESQL_PASSWORD_ORGSVC=${POSTGRESQL_PASSWORD_ORGSVC:-"orgsvc"}
export POSTGRESQL_PASSWORD_PADSVC=${POSTGRESQL_PASSWORD_PADSVC:-"padsvc"}
export POSTGRESQL_PASSWORD_ALMSVC=${POSTGRESQL_PASSWORD_ALMSVC:-"almsvc"}
export POSTGRESQL_PASSWORD_SIGSVC=${POSTGRESQL_PASSWORD_SIGSVC:-"sigsvc"}

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

# Create a temporary directory to put the dist files in.
export DEPLOYMENT_DIST_DIR="dist"

# Customer to use (see `k8s/customer`).
export CUSTOMER_BUILD=${CUSTOMER_BUILD:-"sloothuizen"}

# so you can use ${DOLLAR} as $ sign in files with will be using envsubst for transformation
export DOLLAR='$'

# Debugging
echo CI_COMMIT_REF_SLUG = $CI_COMMIT_REF_SLUG
echo CI_COMMIT_SHORT_SHA = $CI_COMMIT_SHORT_SHA
echo BRANCH_NAME = $BRANCH_NAME
echo COMMIT_SHA = $COMMIT_SHA
echo IMAGE_TAG = $IMAGE_TAG
echo NAMESPACE = $NAMESPACE
echo HHB_HOST = $HHB_HOST
echo HHB_APP_HOST = $HHB_APP_HOST # App host can be different (ocp)
echo DEPLOYMENT_DIST_DIR = $DEPLOYMENT_DIST_DIR

# Create directory to store the dist files for the deployment in
mkdir -p k8s/$DEPLOYMENT_DIST_DIR

echo "Generate kustomization.yaml for $CUSTOMER_BUILD."
cd k8s/$DEPLOYMENT_DIST_DIR

# Create final kustomization.yaml
cat << EOF > kustomization.yaml
---
# generated yaml file
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

patchesStrategicMerge:
- env_patch.yaml
- platform_patch.yaml
EOF

if [ $POSTGRESQL_USE_EXTERNAL != "false" ]
then
  echo "Generate patch use_external_database_patch.yaml with envsubst"
  envsubst < ../templates/use_external_database_patch.yaml > use_external_database_patch.yaml
  echo "add patchesStrategicMerge to kustomization.yaml use_external_database_patch.yaml"
  echo '- use_external_database_patch.yaml' >> kustomization.yaml
fi

if [ $POSTGRESQL_CREATE_DATABASES != "true" ]
then
  echo "Generate patch create_no_databases_patch.yaml with envsubst"
  envsubst < ../templates/create_no_databases_patch.yaml > create_no_databases_patch.yaml
  echo "add patchesStrategicMerge to kustomization.yaml create_no_databases_patch.yaml"
  echo '- create_no_databases_patch.yaml' >> kustomization.yaml
fi

echo "Generate env_patch.yaml / ${USE_PLATFORM}_patch.yaml and ${USE_PLATFORM}_add.yaml"
envsubst < ../templates/env_patch.yaml > env_patch.yaml
envsubst < ../templates/platform/${USE_PLATFORM}/patch.yaml > platform_patch.yaml
envsubst < ../templates/platform/${USE_PLATFORM}/add.yaml > platform_add.yaml

if [ $GENERATE_SECRETS == "true" ]
then
  echo "Generate secrets.yaml with envsubst"
  envsubst < ../templates/secrets.yaml > secrets.yaml
  echo "add resource secrets.yaml"
  kustomize edit add resource secrets.yaml
fi

echo "add resource ../customer/$CUSTOMER_BUILD"
kustomize edit add resource ../customer/$CUSTOMER_BUILD
echo "add resource platform_add.yaml"
kustomize edit add resource platform_add.yaml
echo "set images"
kustomize edit set image backend=${PULL_REPO_IMAGE}/backend:${IMAGE_TAG}
kustomize edit set image backendburgers=${PULL_REPO_IMAGE}/backendburgers:${IMAGE_TAG}
kustomize edit set image banktransactieservice=${PULL_REPO_IMAGE}/banktransactieservice:${IMAGE_TAG}
kustomize edit set image frontend=${PULL_REPO_IMAGE}/frontend:${IMAGE_TAG}
kustomize edit set image grootboekservice=${PULL_REPO_IMAGE}/grootboekservice:${IMAGE_TAG}
kustomize edit set image huishoudboekjeservice=${PULL_REPO_IMAGE}/huishoudboekjeservice:${IMAGE_TAG}
kustomize edit set image logservice=${PULL_REPO_IMAGE}/logservice:${IMAGE_TAG}
kustomize edit set image organisatieservice=${PULL_REPO_IMAGE}/organisatieservice:${IMAGE_TAG}
kustomize edit set image unleashservice=${PULL_REPO_IMAGE}/unleashservice:${IMAGE_TAG}
kustomize edit set image postadressenservice=${PULL_REPO_IMAGE}/postadressenservice:${IMAGE_TAG}
kustomize edit set image alarmenservice=${PULL_REPO_IMAGE}/alarmenservice:${IMAGE_TAG}
kustomize edit set image signalenservice=${PULL_REPO_IMAGE}/signalenservice:${IMAGE_TAG}
kustomize edit set image authservice=${PULL_REPO_IMAGE}/authservice:${IMAGE_TAG}
kustomize edit set image storybook=${PULL_REPO_IMAGE}/storybook:${IMAGE_TAG}
cd ../../

echo "Building Kustomize..."
kustomize build k8s/$DEPLOYMENT_DIST_DIR > k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file.yaml

echo "Applying envvars and create namespace.yaml"
envsubst < k8s/namespace.yaml > k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml

echo "You will find your files in $DEPLOYMENT_DIST_DIR."
echo "Create a namespace if it doesn't exist yet 'kubectl apply -f k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml'"
echo "To deploy, run 'sh k8s/deploy.sh'"
