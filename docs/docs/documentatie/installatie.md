---
id: installatie
title: Installatie
---

## Vereisten
Huishoudboekje kan je met Helm op een Kubernetes cluster installeren.
Productie-implementaties kunnen met behulp van [Haven](https://haven.commonground.nl).
Voor beproevingen kan dat met elk kubernetes cluster of lokaal met [minikube](./developers/local-development).

## Voorbereiding
- Installeer [Helm](https://helm.sh/)
- Download het installatie pakket op https://gitlab.com/commonground/huishoudboekje/app-new/-/jobs/artifacts/master/browse/huishoudboekje?job=build-helm
- Zet het logo bestand klaar in SVG formaat
- Bepaal op welke hostnaam huishoudboekje bereikbaar moet worden
- Haal de gegevens op voor de OpenID Connect koppeling met b.v. ADFS
- Bepaal de huidige versie tag van Huishoudboekje, deze staat rechtsbovenaan op https://gitlab.com/commonground/huishoudboekje/app-new/-/tree/master

### Huisstijl
Zorg voor een logo (SVG-bestand). Dit is het logo dat in het Huishoudboekje zichtbaar zal zijn. 
Daarnaast is het nodig om een `theme.js` bestand te maken, waarin je twee kleuren uit de huisstijl van jouw gemeente kunt 
definiëren. Zie het [thema van de fictieve gemeente Sloothuizen](https://gitlab.com/commonground/huishoudboekje/app-new/-/blob/develop/frontend/theme/sloothuizen/theme.js) voor een voorbeeld.

## Installatie
```shell script
LOGO_SVG="<logo.svg>"
DOMAIN="<huishoudboekje.sloothuizen.nl>"
OIDC_SERVER="<https://adfs.sloothuizen.nl/oidc>"
OIDC_SECRET="<random string>"
IMAGE_TAG=latest
NAMESPACE=huishoudboekje

helm repo add stable "https://charts.helm.sh/stable"
helm repo add zalando-operator "https://raw.githubusercontent.com/zalando/postgres-operator/master/charts/postgres-operator"
helm repo update

helm upgrade --install --create-namespace --namespace $NAMESPACE postgres-operator zalando-operator/postgres-operator \
  --set configKubernetes.watched_namespace="" --set podServiceAccount.name=${NAMESPACE}-postgres-pod

tar zxf huishoudboekje.tgz
 
cp "$LOGO_SVG" huishoudboekje/charts/medewerker-frontend/theme/logo.svg

helm dependency build ./huishoudboekje
helm upgrade --install --create-namespace huishoudboekje ./huishoudboekje \
  --namespace $NAMESPACE \
  --values ./huishoudboekje/values.yaml \
  --set "global.imageTag=$IMAGE_TAG" \
  --set "medewerker-frontend.ingress.hosts[0].host=$DOMAIN" \
  --set "medewerker-frontend.ingress.hosts[0].paths[0]=/" \
  --set "medewerker-backend.ingress.hosts[0].host=$DOMAIN" \
  --set "medewerker-backend.ingress.hosts[0].paths[0]=/api/" \
  --set "medewerker-backend.oidc.issuer=$OIDC_SERVER" \
  --set "medewerker-backend.oidc.clientSecret=$OIDC_SECRET" \
  --set "medewerker-backend.oidc.authorizationEndpoint=$OIDC_SERVER/auth" \
  --set "medewerker-backend.oidc.redirectUri=https://$DOMAIN/api/oidc_callback" \
  --set "medewerker-backend.oidc.tokenUri=$OIDC_SERVER/token" \
  --set "medewerker-backend.oidc.tokeninfoUri=$OIDC_SERVER/tokeninfo" \
  --set "medewerker-backend.oidc.userinfoUri=$OIDC_SERVER/userinfo"
```
