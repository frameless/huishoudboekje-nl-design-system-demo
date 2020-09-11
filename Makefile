
DOCKER_TAG=dev
HELM_NAMESPACE=hhb

.PHONY: all
all: deploy

PHONY: build-images deploy deploy-frontend deploy-backend
build-images: frontend-image~ backend-image~

%-image~: %
	docker build -t registry.gitlab.com/commonground/huishoudboekje/app-new/$<:${DOCKER_TAG} ./$<
	touch $@

deploy: deploy-backend deploy-frontend

deploy-%: %-image~
	$(eval N := $(subst deploy-,,$@))
	helm upgrade --install --create-namespace --namespace ${HELM_NAMESPACE} hhb-$(N) ./$(N)/helm -f ./$(N)/helm/values-minikube.yaml

deploy-frontend: frontend/helm/theme

frontend/helm/theme: frontend/theme/sloothuizen
	(cd frontend/helm; ln -s ../theme/sloothuizen theme)
