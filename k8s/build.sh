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

# Platform to use. Options are azure_review or azure_tad, true or ocp.
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

# Audience that is used for JWTs.
export AUTH_AUDIENCE=${AUTH_AUDIENCE:-$HHB_FRONTEND_ENDPOINT}

# Secret that is used for JWTs.
export HHB_SECRET=${SECRET_KEY:-"test"}

# Passwords for databases
export POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD:-"postgres"}
export POSTGRESQL_PASSWORD_BKTSVC=${POSTGRESQL_PASSWORD_BKTSVC:-"bktsvc"}
export POSTGRESQL_PASSWORD_GRBSVC=${POSTGRESQL_PASSWORD_GRBSVC:-"grbsvc"}
export POSTGRESQL_PASSWORD_HHBSVC=${POSTGRESQL_PASSWORD_HHBSVC:-"hhbsvc"}
export POSTGRESQL_PASSWORD_LOGSVC=${POSTGRESQL_PASSWORD_LOGSVC:-"logsvc"}
export POSTGRESQL_PASSWORD_ORGSVC=${POSTGRESQL_PASSWORD_ORGSVC:-"orgsvc"}

# Settings for OpenID Connect
export OIDC_ISSUER=${OIDC_ISSUER:-"https://$HHB_FRONTEND_DNS/auth"}
export OIDC_CLIENT_ID=${OIDC_CLIENT_ID:-"huishoudboekje"}
export OIDC_CLIENT_SECRET=${OIDC_CLIENT_SECRET:-"test"}
export OIDC_AUTHORIZATION_ENDPOINT=${OIDC_AUTHORIZATION_ENDPOINT:-"https://$HHB_FRONTEND_DNS/auth/auth"}
export OIDC_TOKEN_ENDPOINT=${OIDC_TOKEN_ENDPOINT:-"https://$HHB_FRONTEND_DNS/auth/token"}
export OIDC_TOKENINFO_ENDPOINT=${OIDC_TOKENINFO_ENDPOINT:-"https://$HHB_FRONTEND_DNS/auth/tokeninfo"}
export OIDC_USERINFO_ENDPOINT=${OIDC_USERINFO_ENDPOINT:-"https://$HHB_FRONTEND_DNS/auth/userinfo"}

# Create a temporary directory to put the dist files in.
export DEPLOYMENT_DIST_DIR="dist"

# Customer to use (see `k8s/customer`).
export CUSTOMER_BUILD=${CUSTOMER_BUILD:-"sloothuizen"}

# If we don't need Dex (defaults to false).
export REMOVE_DEX=${REMOVE_DEX:-"false"}

# We use envsubst which checks $ characters and replaces them, please use ${DOLLAR} as literal $ character.
export DOLLAR='$'

# Create directory to store the dist files for the deployment in
mkdir -p k8s/$DEPLOYMENT_DIST_DIR

echo "Generate kustomization.yaml for $CUSTOMER_BUILD."
cd k8s/$DEPLOYMENT_DIST_DIR

# Create final Kustomization for the patches.
cat << EOF > kustomization.yaml
---
# generated yaml file
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

patchesStrategicMerge:
- env_patch.yaml
- ${USE_PLATFORM}_patch.yaml

EOF

echo "Generate env_patch.yaml / ${USE_PLATFORM}_patch.yaml and ${USE_PLATFORM}_add.yaml with envsubst"
envsubst < ../templates/env_patch.yaml > env_patch.yaml
envsubst < ../templates/platform/${USE_PLATFORM}/patch.yaml > ${USE_PLATFORM}_patch.yaml
envsubst < ../templates/platform/${USE_PLATFORM}/add.yaml > ${USE_PLATFORM}_add.yaml

if [ $REMOVE_DEX == "true" ]
then
  if [ -f "../templates/platform/${USE_PLATFORM}/remove_dex_patch.yaml" ]; then
    echo "Generate patch remove_dex_patch.yaml with envsubst"
    envsubst < ../templates/platform/${USE_PLATFORM}/remove_dex_patch.yaml > remove_dex_patch.yaml
    echo '- remove_dex_patch.yaml' >> kustomization.yaml
  fi
fi

if [ $GENERATE_SECRETS == "true" ]
then
  echo "Generate secrets.yaml with envsubst"
  envsubst < ../templates/secrets.yaml > secrets.yaml
  echo "Adding secrets to kustomization.yaml"
  kustomize edit add resource secrets.yaml
fi

kustomize edit add resource ${USE_PLATFORM}_add.yaml
kustomize edit add resource ../customer/$CUSTOMER_BUILD
kustomize edit set image backend=${PULL_REPO_IMAGE}/backend:${IMAGE_TAG}
kustomize edit set image banktransactieservice=${PULL_REPO_IMAGE}/banktransactieservice:${IMAGE_TAG}
kustomize edit set image frontend=${PULL_REPO_IMAGE}/frontend:${IMAGE_TAG}
kustomize edit set image grootboekservice=${PULL_REPO_IMAGE}/grootboekservice:${IMAGE_TAG}
kustomize edit set image huishoudboekjeservice=${PULL_REPO_IMAGE}/huishoudboekjeservice:${IMAGE_TAG}
kustomize edit set image logservice=${PULL_REPO_IMAGE}/logservice:${IMAGE_TAG}
kustomize edit set image organisatieservice=${PULL_REPO_IMAGE}/organisatieservice:${IMAGE_TAG}
kustomize edit set image unleashservice=${PULL_REPO_IMAGE}/unleashservice:${IMAGE_TAG}
cd ../../

kustomize build k8s/$DEPLOYMENT_DIST_DIR > k8s/$DEPLOYMENT_DIST_DIR/single_deploy_file.yaml

echo "Applying envvars and create namespace.yaml"
envsubst < k8s/namespace.yaml > k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml

echo "You will find your files in $DEPLOYMENT_DIST_DIR."
echo "Create a namespace if it doesn't exist yet 'kubectl apply -f k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml'"
echo "To deploy, run 'sh k8s/deploy.sh'"