
NAMESPACE := huishoudboekje
RELEASE := huishoudboekje
PYTHON_MODULES := $(patsubst %/setup.py,%,$(wildcard */*/setup.py) $(wildcard */setup.py))
SERVICE_MODULES := $(patsubst services/%/Makefile,%,$(wildcard services/*/Makefile))
THEME := sloothuizen
SERVICE_CONTEXT_IMAGES := $(patsubst services/%/Dockerfile,%,$(wildcard services/*/Dockerfile))
DIRECT_CONTEXT_IMAGES := $(patsubst %/Dockerfile,%,$(wildcard */Dockerfile))
IMAGES := $(DIRECT_CONTEXT_IMAGES) $(SERVICE_CONTEXT_IMAGES)

IMAGE_PREFIX ?= registry.gitlab.com/commonground/huishoudboekje/app-new/
IMAGE_TAG ?= dev
COMPONENT_TAG ?= dev
COMPONENT_COMMIT_HASH ?= undefined
COMPONENT_VERSION ?= 0.20.0
DOCKER_PROXY ?=

# Main target to build and deploy Huishoudboekje locally
.PHONY: all
all: huishoudboekje

# Runs the tests
# (for now it depends on minikube)
.PHONY: test
test: huishoudboekje-test

.PHONY: helm-init
helm-init:
	helm repo add stable "https://charts.helm.sh/stable"
	helm repo add bitnami "https://charts.bitnami.com/bitnami"
	helm repo update

.PHONY: huishoudboekje-test
huishoudboekje-test: huishoudboekje
	helm test --logs --namespace $(NAMESPACE) $<

helm/repo/huishoudboekje-$(COMPONENT_VERSION).tgz:
	make -C helm

helm/theme.yaml:
	make -C $(@D) $(@F)

.PHONY: huishoudboekje
huishoudboekje: helm/repo/huishoudboekje-$(COMPONENT_VERSION).tgz helm/theme.yaml docker-images
	helm upgrade --install --create-namespace --namespace $@ \
		$@  $< \
		--debug \
		--values helm/theme.yaml \
		--set "medewerker-backend.extraEnv[0].name=OIDC_CLOCK_SKEW" \
		--set "medewerker-backend.extraEnv[0].value='500'" \
		--set database.traefik.enabled=true \
		--set global.minikube=true \
		--set global.imageTag=$(IMAGE_TAG) \
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

#helm/theme.yaml: frontend/theme/$(THEME) FORCE
	#helm/theme-yaml.sh $< > $@

preparedb:
	for service in $(SERVICE_MODULES); do make -C services/$$service $@; done

requirements:
	for python_module in $(PYTHON_MODULES); do make -C $$python_module $@; done

FORCE:

.PHONY: docker-images
docker-images: $(patsubst %,build/%.docker_image,$(DIRECT_CONTEXT_IMAGES))
docker-images: $(patsubst %,build/%.docker_image,$(SERVICE_CONTEXT_IMAGES))

$(patsubst %,%/.docker_image,$(DIRECT_CONTEXT_IMAGES)):
$(patsubst %,%/.docker_image,$(SERVICE_CONTEXT_IMAGES)):


build/%.docker_image: %/Dockerfile
	$(eval IMAGE := $(IMAGE_PREFIX)$(subst _,-,$(patsubst services/%,%,$(<D))):$(IMAGE_TAG))
	docker build \
		--tag $(IMAGE) \
		--build-arg "COMPONENT_TAG=$(COMPONENT_TAG)" \
		--build-arg "COMPONENT_COMMIT_HASH=$(COMPONENT_COMMIT_HASH)" \
		--build-arg "COMPONENT_VERSION=$(COMPONENT_VERSION)" \
		--build-arg "DOCKER_PROXY=$(DOCKER_PROXY)" \
		$(<D)
	mkdir -p $(@D)
	echo $(IMAGE) > $@

build/%.docker_image: services/%/Dockerfile
	$(eval IMAGE := $(IMAGE_PREFIX)$(subst _,-,$(patsubst services/%,%,$(<D))):$(IMAGE_TAG))
	docker build \
		--tag $(IMAGE) \
		--build-arg "COMPONENT_TAG=$(COMPONENT_TAG)" \
		--build-arg "COMPONENT_COMMIT_HASH=$(COMPONENT_COMMIT_HASH)" \
		--build-arg "COMPONENT_VERSION=$(COMPONENT_VERSION)" \
		--build-arg "DOCKER_PROXY=$(DOCKER_PROXY)" \
		--file $< \
		services
	mkdir -p $(@D)
	echo $(IMAGE) > $@

.PHONY: docker-push
docker-push: $(patsubst %,build/%.push,$(DIRECT_CONTEXT_IMAGES))
docker-push: $(patsubst %,build/%.push,$(SERVICE_CONTEXT_IMAGES))

build/%.push: build/%.docker_image
	docker push $(shell cat $<)
