COMPONENT_VERSION ?= 0.20.0
IMAGE_TAG ?= dev

.PHONY: all
all: repo/index.yaml

.PHONY: init
init:
	helm repo add stable "https://charts.helm.sh/stable"
	helm repo add bitnami "https://charts.bitnami.com/bitnami"
	helm repo update

.PHONY: lint
lint: init
	helm lint charts/*

repo/%-$(COMPONENT_VERSION).tgz: charts/% repo
	yq --inplace e ".global.imageTag = \"$(IMAGE_TAG)\"" $</values.yaml
	helm package $< --dependency-update --destination $(@D)

repo/robots.txt: repo
	echo "User-Agent: *\nDisallow: /" > repo/robots.txt

repo/index.yaml: repo/robots.txt repo/huishoudboekje-$(COMPONENT_VERSION).tgz
	helm repo index --url $${CI_PAGES_URL:-http://localhost:5000} repo

repo: init dependencies lint charts/huishoudboekje/theme.yaml
	mkdir -p $@

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
dependencies: version $(find . -name 'Chart.lock')

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
