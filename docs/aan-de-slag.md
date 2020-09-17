# Huishoudboekje

## Vereisten

HHB is gemaakt om op met Helm op een Kubernetes cluster geinstaleerd te worden.
Voor productie implementaties kan met behulp van [Haven](https://haven.commonground.nl).
Voor beproevingen kan dat met elk kubernetes cluster of lokaal mbv [minikube](./local-development)


## Voorbereiding

- Certificaten
- Logo (SVG bestand)
- Kubectl setup


## Installatie

```shell script
DOMAIN="<sloothuizen.nl>"
OIDC_SERVER="<https://oidc.sloothuizen.nl>"
OIDC_SECRET="<random string>"
LOGO_SVG="<logo.svg>"
mkdir frontend/helm/theme
cp "frontend/theme/sloothuizen/theme.js" "$LOGO_SVG" frontend/helm/theme
helm upgrade --install --namespace huishoudboekje --create-namespace \
  huishoudboekje-frontend ./frontend/helm \
  --set "ingress.enabled=true" \
  --set "ingress.hosts[0].host=huishoudboekje.$DOMAIN" \
  --set "ingress.hosts[0].paths[0]=/" \
  --set "image.tag=registry.gitlab.com/commonground/huishoudboekje/app-new/frontend:latest"
helm upgrade --install --namespace huishoudboekje --create-namespace \
  huishoudboekje-backend ./backend/helm \
      --set "ingress.enabled=true" \
      --set "ingress.hosts[0].host=huishoudboekje.$DOMAIN" \
      --set "ingress.hosts[0].paths[0]=/api/" \
      --set "oidc.issuer=https://$OIDC_SERVER" \
      --set "oidc.client=huishoudboekje" \
      --set "oidc.secret=$OIDC_SECRET" \
      --set "oidc.authorizationEndpoint=$OIDC_SERVER/auth" \
      --set "oidc.redirectUri=$OIDC_SERVER/api/oidc_callback" \
      --set "oidc.tokenUri=$OIDC_SERVER/token" \
      --set "oidc.tokenInfoUri=$OIDC_SERVER/tokenInfo" \
      --set "image.tag=registry.gitlab.com/commonground/huishoudboekje/app-new/backend:latest"
```
