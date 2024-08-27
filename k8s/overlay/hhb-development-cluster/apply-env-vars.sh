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


# OIDC Settings
export OIDC_ISSUER_URL=${OIDC_ISSUER_URL:-"this should be a issuer url"}
export OIDC_CLIENT_ID=${AZURE_APP_ID:-"this should come generated pipeline envvar"}
export OIDC_CLIENT_SECRET=${AZURE_APP_SECRET:-"this should come generated pipeline envvar"}
export OIDC_BASE_URL=${OIDC_BASE_URL:-$HHB_APP_HOST}
export JWT_ISSUER=${JWT_ISSUER:-$HHB_APP_HOST}
export JWT_AUDIENCE=${AZURE_APP_ID:-"this should come generated pipeline envvar"}
export JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-"30d"}
export JWT_SECRET=${AZURE_APP_SECRET:-"this should come generated pipeline envvar"}
export JWT_ALGORITHMS=${JWT_ALGORITHMS:-"HS256"}
export JWT_JWKS_URI=${JWT_JWKS_URI}
export OIDC_SCOPES=${AZURE_APP_SCOPE:-"this should come generated pipeline envvar"}

# redis
export REDIS_PASSWORD=${REDIS_PASSWORD:-"averyinsecurebutstillalongpasswordbecausethedocssayithastobealongpaswordtobesecuresoihopethisislongenough"}
export REDIS_AUTH_PASSWORD=${REDIS_AUTH_PASSWORD:-"authservicepasswordforredis12345"}
# rabbitmq Settings
export RABBITMQ_DEFAULT_USER=${RABBITMQ_DEFAULT_USER:-"guest-user"} #default value is unsafe
export RABBITMQ_DEFAULT_PASS=${RABBITMQ_DEFAULT_PASS:-"guest-pass"} #default value is unsafe

export USERAPI_KEYS=${USERAPI_KEYS:-""}

cd k8s/overlay/hhb-development-cluster

echo "Applying envvars."
envsubst < components/configmaps/sample.redis.conf > components/configmaps/redis.conf
envsubst < components/configmaps/sample.kustomization.yaml > components/configmaps/kustomization.yaml
envsubst < components/set-images/sample.kustomization.yaml > components/set-images/kustomization.yaml
envsubst < components/patches/ingress/host-name/sample.ingress-host-patch.yaml > components/patches/ingress/host-name/ingress-host-patch.yaml


