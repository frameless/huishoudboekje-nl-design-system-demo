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
repo: init lint
	mkdir -p $@
	mkdir -p charts/huishoudboekje/charts/medewerker-frontend/theme
	cp -r ../frontend/theme/sloothuizen/ charts/huishoudboekje/charts/medewerker-frontend/theme || true
	echo "User-Agent: *\nDisallow: /" > repo/robots.txt
	helm package charts/huishoudboekje --dependency-update --destination repo/
	helm repo index --url $${CI_PAGES_URL:-http://localhost:5000} repo

.PHONY: dependencies
dependencies: $(wildcard charts/*/Chart.lock)

%/Chart.lock: %/Chart.yaml
	helm dependency update $(@D)
	helm dependency build $(@D)

