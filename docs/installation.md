## Vereisten

Huishoudboekje is gemaakt om op met Helm op een Kubernetes cluster geïnstalleerd te worden.
Voor productie implementaties kan met behulp van [Haven](https://haven.commonground.nl).
Voor beproevingen kan dat met elk kubernetes cluster of lokaal mbv [minikube](./local-development)


## Voorbereiding

- Certificaten
- Logo (SVG bestand)
- Kubectl setup


## Installatie

```shell script
LOGO_SVG="<logo.svg>"
DOMAIN="<huishoudboekje.sloothuizen.nl>"
OIDC_SERVER="<https://adfs.sloothuizen.nl/oidc>"
OIDC_SECRET="<random string>"
IMAGE_TAG=latest
wget -O huishoudboekje.tgz https://gitlab.com/commonground/huishoudboekje/app-new/-/jobs/artifacts/master/browse?job=build-helm
tar zxf huishoudboekje.tgz
 
cp "$LOGO_SVG" huishoudboekje/charts/medewerker-frontend/theme/logo.svg
helm repo add stable "https://kubernetes-charts.storage.googleapis.com"
helm repo update
helm dependency build ./huishoudboekje
helm upgrade --install --create-namespace "huishoudboekje" ./huishoudboekje \
    --namespace huishoudboekje \
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
