
DOCKER_TAG := dev
REGISTRY_PREFIX := registry.gitlab.com/commonground/huishoudboekje/app-new
CHART_DEPENDENCIES := $(shell find helm -name 'Chart.yaml' | xargs grep -l 'dependencies:')
NAMESPACE := huishoudboekje
RELEASE := huishoudboekje
SERVICE_MODULES := $(patsubst services/%/Makefile,%,$(wildcard services/*/Makefile))
THEME := nijmegen

# Main target to build and deploy Huishoudboekje locally
.PHONY: all
all: chart-dependencies huishoudboekje

# Runs the tests
# (for now it depends on minikube)
.PHONY: test
test: huishoudboekje-test

.PHONY: chart-dependencies
chart-dependencies: $(CHART_DEPENDENCIES:.yaml=.lock)

.PHONY: helm-init
helm-init:
	helm repo add stable "https://charts.helm.sh/stable"
	helm repo add bitnami "https://charts.bitnami.com/bitnami"
	helm repo update

.PHONY: huishoudboekje-test
huishoudboekje-test: huishoudboekje
	helm test --logs --namespace $(NAMESPACE) $<

.PHONY: huishoudboekje
huishoudboekje: helm/charts/huishoudboekje # helm-init helm/charts/* docker-images
	helm upgrade --install --create-namespace --namespace $@ \
		$@ $< \
		--debug \
		--values helm/theme.yaml \
		--set database.traefik.enabled=true \
		--set global.minikube=true \
		--set global.imageTag=$(DOCKER_TAG) \
		--set "medewerker-backend.appSettings=hhb_backend.config.DevelopmentConfig" \
		--set "medewerker-backend.oidc.redirectUris[0].prefix=http://localhost:3000" \
		--set "medewerker-backend.oidc.redirectUris[0].callback=http://localhost:3000/api/custom_oidc_callback" \
		--set "medewerker-backend.oidc.redirectUris[1].prefix=http://hhb.minikube" \
		--set "medewerker-backend.oidc.redirectUris[1].callback=http://hhb.minikube/api/custom_oidc_callback" \
		--set "persistence.enabled=true" \
		--set "postgresql.postgresqlPassword=huishoudboekjedb" \
		--render-subchart-notes

helm/charts/%: helm/charts/%/Chart.lock

%/Chart.lock: %/Chart.yaml
	helm dependency update $(@D)
	helm dependency build $(@D)

.PHONY: docker-images
docker-images: docker-compose.yaml
	docker-compose -f $< build --parallel

helm/theme.yaml: frontend/theme/$(THEME) FORCE
	helm/theme-yaml.sh $< > $@

preparedb:
	for service in $(SERVICE_MODULES); do make -C services/$$service $@; done

FORCE:
