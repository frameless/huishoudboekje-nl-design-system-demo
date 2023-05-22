#!/bin/bash

set -e
# This file requires envvars CI_REGISTRY_IMAGE, IMAGE_TAG and DOCKER_PROXY to be set.
# If you are using GitLab, $CI_REGISTRY_IMAGE should already be set.

# Build docker images for all components
docker build -t $CI_REGISTRY_IMAGE/frontend:$IMAGE_TAG               --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./frontend
docker build -t $CI_REGISTRY_IMAGE/backend:$IMAGE_TAG                --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./backend
docker build -t $CI_REGISTRY_IMAGE/backendburgers:$IMAGE_TAG         --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./backend-burgers
docker build -t $CI_REGISTRY_IMAGE/unleashservice:$IMAGE_TAG         --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/unleashservice
docker build -t $CI_REGISTRY_IMAGE/postadressenservice:$IMAGE_TAG    --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/postadressenservice
docker build -t $CI_REGISTRY_IMAGE/alarmenservice:$IMAGE_TAG         --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/alarmenservice
docker build -t $CI_REGISTRY_IMAGE/signalenservice:$IMAGE_TAG        --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/signalenservice
docker build -t $CI_REGISTRY_IMAGE/authservice:$IMAGE_TAG            --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/authservice
docker build -t $CI_REGISTRY_IMAGE/banktransactieservice:$IMAGE_TAG  --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/bank_transactie_service
docker build -t $CI_REGISTRY_IMAGE/grootboekservice:$IMAGE_TAG       --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/grootboek_service
docker build -t $CI_REGISTRY_IMAGE/huishoudboekjeservice:$IMAGE_TAG  --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/huishoudboekje_service
docker build -t $CI_REGISTRY_IMAGE/logservice:$IMAGE_TAG             --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/log_service
docker build -t $CI_REGISTRY_IMAGE/organisatieservice:$IMAGE_TAG     --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/organisatie_service
docker build -t $CI_REGISTRY_IMAGE/rapportageservice:$IMAGE_TAG      --build-arg "DOCKER_PROXY=$DOCKER_PROXY"   ./services/rapportage_service

# Push all docker images to the registry
docker push $CI_REGISTRY_IMAGE/frontend:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/backend:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/backendburgers:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/unleashservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/postadressenservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/alarmenservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/signalenservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/authservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/banktransactieservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/grootboekservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/huishoudboekjeservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/logservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/organisatieservice:$IMAGE_TAG
docker push $CI_REGISTRY_IMAGE/rapportageservice:$IMAGE_TAG
