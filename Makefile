
DOCKER_TAG=dev
HELM_NAMESPACE=hhb

.PHONY: all dex backend frontend
all: dex backend frontend

backend frontend:
	@echo build $@
	$(eval IMAGE := registry.gitlab.com/commonground/huishoudboekje/app-new/$@:${DOCKER_TAG})
	docker build -t $(IMAGE) ./$@
	$(eval IMAGE_HASH := $(shell docker images --no-trunc --quiet $(IMAGE)))
	helm upgrade --install --create-namespace --namespace ${HELM_NAMESPACE} hhb-$@ ./$@/helm -f ./$@/helm/values-minikube.yaml --set image.hash=$(IMAGE_HASH)
	#kubectl --namespace ${HELM_NAMESPACE} patch deployment hhb-${@}-huishoudboekje-$@ -p \
	#		"{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"date\":\"`date +'%s'`\"}}}}}"

frontend: frontend/helm/theme

dex:
	helm repo add stable "https://kubernetes-charts.storage.googleapis.com"
	helm dependency update ./helm
	helm dependency build ./helm
	helm upgrade --install --create-namespace hhb-dex ./helm --namespace ${HELM_NAMESPACE} -f ./helm/values-minikube.yaml

frontend/helm/theme: frontend/theme/sloothuizen
	(cd frontend/helm; ln -s ../theme/sloothuizen theme)
