#!/bin/bash

set -e
# Take the name of the current branch and the short hash of the current commit
# from CI_COMMIT_REF_SLUG and CI_COMMIT_SHORT_SHA, or from git.
BRANCH_NAME=${CI_COMMIT_REF_SLUG:-$(git rev-parse --abbrev-ref HEAD)}
BRANCH_NAME=${BRANCH_NAME//_/-}
COMMIT_SHA=${CI_COMMIT_SHORT_SHA:-$(git rev-parse --short HEAD)}

# If use BRANCH_NAME and COMMIT_SHA as the IMAGE_TAG, you can override this by providing IMAGE_TAG.
export IMAGE_TAG=${IMAGE_TAG:-${BRANCH_NAME}-$COMMIT_SHA}

# Use the provided NAMESPACE or "huishoudboekje" as the default.
export NAMESPACE=${NAMESPACE:-huishoudboekje}

# Use the provided HHB_HOST or "hhb.minikube" as the default.
export HHB_HOST=${HHB_HOST:-hhb.minikube}

# Use the provided PULL_REPO_IMAGE or "registry.gitlab.com/commonground/huishoudboekje/app-new" as the default
export PULL_REPO_IMAGE=${PULL_REPO_IMAGE:-registry.gitlab.com/commonground/huishoudboekje/app-new}

export USE_PLATFORM=${USE_PLATFORM:-"true"}
export DEFAULT_REPLICAS=${DEFAULT_REPLICAS:-"1"}
export GENERATE_SECRETS=${GENERATE_SECRETS:-"true"}
export HHB_SECRET=${SECRET_KEY:-"test"}
export CERT_MANAGER_ISSUER=${CERT_MANAGER_ISSUER:-"letsencrypt-prod"} # only for true-platform
export HHB_APP_HOST=${HHB_APP_HOST:-$HHB_HOST}

export HHB_FRONTEND_DNS=${HHB_FRONTEND_DNS:-"$HHB_HOST"}
export HHB_FRONTEND_ENDPOINT=${HHB_FRONTEND_ENDPOINT:-"https://$HHB_FRONTEND_DNS"}
export HHB_API_ENDPOINT=${HHB_API_ENDPOINT:-"$HHB_FRONTEND_ENDPOINT/api"}
export AUTH_AUDIENCE=${AUTH_AUDIENCE:-$HHB_FRONTEND_ENDPOINT}

export POSTGRESQL_PASSWORD=${POSTGRESQL_PASSWORD:-"postgres"}
export POSTGRESQL_PASSWORD_BKTSVC=${POSTGRESQL_PASSWORD_BKTSVC:-"bktsvc"}
export POSTGRESQL_PASSWORD_GRBSVC=${POSTGRESQL_PASSWORD_GRBSVC:-"grbsvc"}
export POSTGRESQL_PASSWORD_HHBSVC=${POSTGRESQL_PASSWORD_HHBSVC:-"hhbsvc"}
export POSTGRESQL_PASSWORD_LOGSVC=${POSTGRESQL_PASSWORD_LOGSVC:-"logsvc"}
export POSTGRESQL_PASSWORD_ORGSVC=${POSTGRESQL_PASSWORD_ORGSVC:-"orgsvc"}

# Create a temporary directory to put the dist files in.
export DEPLOYMENT_DIST_DIR="dist"
export CUSTOMER_BUILD=${CUSTOMER_BUILD:-"sloothuizen"}

# Debugging
echo CI_COMMIT_REF_SLUG = $CI_COMMIT_REF_SLUG
echo CI_COMMIT_SHORT_SHA = $CI_COMMIT_SHORT_SHA
echo BRANCH_NAME = $BRANCH_NAME
echo COMMIT_SHA = $COMMIT_SHA
echo IMAGE_TAG = $IMAGE_TAG
echo NAMESPACE = $NAMESPACE
echo HHB_HOST = $HHB_HOST
echo HHB_APP_HOST = $HHB_APP_HOST # App host can be diffrent (ocp)
echo DEPLOYMENT_DIST_DIR = $DEPLOYMENT_DIST_DIR

# Create directory to store the dist files for the deployment in
mkdir -p k8s/$DEPLOYMENT_DIST_DIR

echo "Generate kustomization.yaml for $CUSTOMER_BUILD"
cd k8s/$DEPLOYMENT_DIST_DIR

cat << EOF > kustomization.yaml
---
# generated yaml file
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

patchesStrategicMerge:
- env_patch.yaml
- ${USE_PLATFORM}_patch.yaml

EOF

echo "Generate env_patch/${USE_PLATFORM}_patch.yaml with envsubst"
envsubst < ../templates/env_patch.yaml > env_patch.yaml
envsubst < ../templates/platform/${USE_PLATFORM}/patch.yaml > ${USE_PLATFORM}_patch.yaml
envsubst < ../templates/platform/${USE_PLATFORM}/add.yaml > ${USE_PLATFORM}_add.yaml

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

echo "You will find your files in $DEPLOYMENT_DIST_DIR. "
echo "make napespace if it doesn't exist yet 'kubectl apply -f k8s/$DEPLOYMENT_DIST_DIR/namespace.yaml'"
echo "you can run 'sh k8s/deploy.sh'"