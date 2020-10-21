
DOCKER_TAG := dev
REGISTRY_PREFIX := registry.gitlab.com/commonground/huishoudboekje/app-new
CHART_DEPENDENCIES := $(shell find helm -name 'Chart.yaml' | xargs grep -l 'dependencies:')
NAMESPACE := huishoudboekje
RELEASE := huishoudboekje
MODULES := backend frontend huishoudboekje-service organisatie-service

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
	helm repo add stable "https://kubernetes-charts.storage.googleapis.com"
	helm repo add zalando-operator "https://raw.githubusercontent.com/zalando/postgres-operator/master/charts/postgres-operator"
	#helm repo add zalando-operator-ui "https://raw.githubusercontent.com/zalando/postgres-operator/master/charts/postgres-operator-ui"
	helm repo update

.PHONY: huishoudboekje-test
huishoudboekje-test: huishoudboekje
	helm test --logs --namespace $(NAMESPACE) $<

.PHONY: postgres-operator
postgres-operator: helm/postgres-operator.yaml helm-init
	helm upgrade --install --create-namespace --namespace ${NAMESPACE} \
		$@ zalando-operator/postgres-operator \
		--values helm/postgres-operator.yaml \
		--set podServiceAccount.name=${NAMESPACE}-postgres-pod \
		--set serviceAccount.name=${NAMESPACE}-postgres-operator

.PHONY: huishoudboekje
huishoudboekje: helm/charts/huishoudboekje-review helm-init postgres-operator $(MODULES)
	helm upgrade --install --create-namespace --namespace $@ \
		$@ $< \
		--set database.traefik.enabled=true \
		--set global.minikube=true \
		--set global.imageTag=$(DOCKER_TAG) \
    	--set "medewerker-backend.oidc.redirectUris[0].prefix=http://localhost:3000" \
    	--set "medewerker-backend.oidc.redirectUris[0].callback=http://localhost:3000/api/custom_oidc_callback" \
    	--set "medewerker-backend.oidc.redirectUris[1].prefix=http://hhhb.minikube" \
    	--set "medewerker-backend.oidc.redirectUris[1].callback=http://hhhb.minikube/api/custom_oidc_callback" \
		--render-subchart-notes

helm/charts/%: helm/charts/%/Chart.lock

%/Chart.lock: %/Chart.yaml
	helm dependency update $(@D)
	helm dependency build $(@D)

.PHONY: $(MODULES)
$(MODULES):
	$(eval IMAGE := $(REGISTRY_PREFIX)/$@:$(DOCKER_TAG))
	docker build -t $(IMAGE) ./$@

frontend: helm/charts/medewerker-frontend/theme

helm/charts/medewerker-frontend/theme: frontend/theme/sloothuizen
	(cd helm/charts/medewerker-frontend; ln -s ../../../frontend/theme/sloothuizen theme)
