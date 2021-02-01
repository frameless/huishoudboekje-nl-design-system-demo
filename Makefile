
DOCKER_TAG := dev
REGISTRY_PREFIX := registry.gitlab.com/commonground/huishoudboekje/app-new
CHART_DEPENDENCIES := $(shell find helm -name 'Chart.yaml' | xargs grep -l 'dependencies:')
NAMESPACE := huishoudboekje
RELEASE := huishoudboekje
SERVICE_MODULES := $(patsubst services/%/Makefile,%,$(wildcard services/*/Makefile))
THEME := sloothuizen
SERVICE_CONTEXT_IMAGES := $(SERVICE_MODULES)
DIRECT_CONTEXT_IMAGES := $(patsubst %/Dockerfile,%,$(wildcard */Dockerfile))
IMAGES := $(DIRECT_CONTEXT_IMAGES) $(SERVICE_CONTEXT_IMAGES)

IMAGE_TAG ?= dev
COMPONENT_TAG ?= dev
COMPONENT_COMMIT_HASH ?= undefined
COMPONENT_VERSION ?= 0.20.0
DOCKER_PROXY ?=

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

helm/theme.yaml: frontend/theme/$(THEME) FORCE
	helm/theme-yaml.sh $< > $@

preparedb:
	for service in $(SERVICE_MODULES); do make -C services/$$service $@; done

FORCE:

.PHONY: docker-images
docker-images: $(patsubst %,build/%.direct_context_image,$(DIRECT_CONTEXT_IMAGES))
docker-images: $(patsubst %,build/%.service_context_image,$(SERVICE_CONTEXT_IMAGES))

$(patsubst %,%/.direct_context_image,$(DIRECT_CONTEXT_IMAGES)):
$(patsubst %,%/.service_context_image,$(SERVICE_CONTEXT_IMAGES)):

build/%.direct_context_image: %/Dockerfile
	@echo "Building $<"
	docker build \
		--tag $(REGISTRY_PREFIX)/$(<D):$(IMAGE_TAG) \
		--build-arg "COMPONENT_TAG=$(COMPONENT_TAG)" \
		--build-arg "COMPONENT_COMMIT_HASH=$(COMPONENT_COMMIT_HASH)" \
		--build-arg "COMPONENT_VERSION=$(COMPONENT_VERSION)" \
		--build-arg "DOCKER_PROXY=$(DOCKER_PROXY)" \
		$(<D)
	mkdir -p $(@D)
	echo $(REGISTRY_PREFIX)/$(<D):$(IMAGE_TAG) > $@

build/%.service_context_image: services/%/Dockerfile
	@echo "Building $<"
	docker build \
		--tag $(REGISTRY_PREFIX)/$(subst _,-,$(patsubst services/%,%,$(<D))):$(IMAGE_TAG) \
		--build-arg "COMPONENT_TAG=$(COMPONENT_TAG)" \
		--build-arg "COMPONENT_COMMIT_HASH=$(COMPONENT_COMMIT_HASH)" \
		--build-arg "COMPONENT_VERSION=$(COMPONENT_VERSION)" \
		--build-arg "DOCKER_PROXY=$(DOCKER_PROXY)" \
		--file $< \
		services
	mkdir -p $(@D)
	echo $(REGISTRY_PREFIX)/$(subst _,-,$(patsubst services/%,%,$(<D))):$(IMAGE_TAG) > $@

.PHONY: docker-push
docker-push: $(patsubst %,build/%.direct_push,$(DIRECT_CONTEXT_IMAGES))
docker-push: $(patsubst %,build/%.service_push,$(SERVICE_CONTEXT_IMAGES))

build/%.service_push: build/%.service_context_image
	docker push $(shell cat $<)
build/%.direct_push: build/%.direct_context_image
	docker push $(shell cat $<)
