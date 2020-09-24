
DOCKER_TAG=dev
REGISTRY_PREFIX="registry.gitlab.com/commonground/huishoudboekje/app-new"

.PHONY: all backend frontend huishoudboekje
all: huishoudboekje

huishoudboekje: backend frontend
	helm dependency build ./helm/charts/huishoudboekje-review
	helm upgrade --install --create-namespace --namespace huishoudboekje huishoudboekje ./helm/charts/huishoudboekje-review --set global.imageTag=$(DOCKER_TAG)

backend frontend:
	$(eval IMAGE := $(REGISTRY_PREFIX)/$@:$(DOCKER_TAG))
	docker build -t $(IMAGE) ./$@

frontend: helm/charts/medewerker-frontend/theme

helm/charts/medewerker-frontend/theme: frontend/theme/sloothuizen
	(cd helm/charts/medewerker-frontend; ln -s ../../../frontend/theme/sloothuizen theme)
