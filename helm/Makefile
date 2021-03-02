COMPONENT_VERSION ?= 0.20.0

.PHONY: all
all: repo

.PHONY: init
init:
	helm repo add stable "https://charts.helm.sh/stable"
	helm repo add bitnami "https://charts.bitnami.com/bitnami"
	helm repo update

.PHONY: lint
lint: init
	helm lint charts/*

.PHONY: repo
repo: init dependencies lint charts/huishoudboekje/theme.yaml
	mkdir -p $@
	echo "User-Agent: *\nDisallow: /" > repo/robots.txt
	helm package charts/huishoudboekje --dependency-update --destination repo/
	helm repo index --url $${CI_PAGES_URL:-http://localhost:5000} repo

charts/huishoudboekje/theme.yaml: ../frontend/theme/sloothuizen/
	sh theme-yaml.sh $< > $@

theme.yaml: ../frontend/theme/sloothuizen/
	sh theme-yaml.sh $< > $@

.PHONY: version
version:
	find . -name 'Chart.yaml' | \
		xargs grep -l '^version:' | \
		xargs -n 1 yq --prettyPrint --inplace eval ".version = \"$(COMPONENT_VERSION)\""
	find . -name 'Chart.yaml' | \
		xargs grep -l '^appVersion:' | \
		xargs -n 1 yq --prettyPrint --inplace eval ".appVersion = \"$(COMPONENT_VERSION)\""

.PHONY: dependencies
dependencies: version $(shell find . -name 'Chart.lock')

.PHONY: touch-dependencies
touch-dependencies:
	touch $(patsubst %.lock,%.yaml,$(wildcard charts/*/Chart.yaml))

.PHONY: force-dependencies
force-dependencies: touch-dependencies dependencies

%/Chart.lock: %/Chart.yaml
	helm dependency update $(@D)
	helm dependency build $(@D)

clean:
	rm -rf repo
	rm -rf charts/huishoudboekje/charts/*.tgz
