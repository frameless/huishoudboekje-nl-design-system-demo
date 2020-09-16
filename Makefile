
DOCKER_TAG=dev
HELM_NAMESPACE=hhb

.PHONY: all
all: deploy

PHONY: build-images deploy deploy-frontend deploy-backend
build-images: frontend-image~ backend-image~

%-image~: %
	$(eval IMAGE := registry.gitlab.com/commonground/huishoudboekje/app-new/$<:${DOCKER_TAG})
	docker build -t $(IMAGE) ./$<
	docker images --no-trunc --quiet $(IMAGE) > $@

deploy: deploy-backend deploy-frontend deploy-dex

deploy-%: %-image~
	$(eval NAME := $(subst deploy-,,$@))
	echo $< $(shell cat < $<)
	helm upgrade --install --create-namespace --namespace ${HELM_NAMESPACE} hhb-$(NAME) ./$(NAME)/helm -f ./$(NAME)/helm/values-minikube.yaml --set-string image.hash=$(shell cat $<)

deploy-frontend: frontend/helm/theme

deploy-dex:
	helm repo add stable "https://kubernetes-charts.storage.googleapis.com"
	helm repo update
	helm dependency build ./helm
	helm upgrade --install --create-namespace hhb-dex ./helm --namespace ${HELM_NAMESPACE} -f ./helm/values-minikube.yaml

frontend/helm/theme: frontend/theme/sloothuizen
	(cd frontend/helm; ln -s ../theme/sloothuizen theme)
