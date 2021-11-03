# Deploy HHB in True

Below is a description of the minimum you need to do to be able to deploy on the platform True. Description of all variables that can be set can be found here: [link](k8s_build_and_deploy.md)

## Deploy huishoudboekje on TRUE (true.nl)

Follow the instructions you get from true and switch your context to this.

Setup some environment variable (needs to know you are targeting true)

ACC environment

```bash
export USE_PLATFORM='true'
export HHB_HOST='huishoudboekje-accp.nijmegen.nl'
export NAMESPACE='huishoudboekje-acc'
export CERT_MANAGER_ISSUER='letsencrypt-prod'

export REMOVE_DEX="true" # use login.microsoftonline.com OpenId

export NIJMEGEN_OIDC_TENANT_ID="changeme"
export OIDC_CLIENT_ID="changeme"
export OIDC_CLIENT_SECRET="changeme"
export OIDC_ISSUER="https://login.microsoftonline.com/${NIJMEGEN_OIDC_TENANT_ID}/v2.0"
export OIDC_AUTHORIZATION_ENDPOINT="https://login.microsoftonline.com/${NIJMEGEN_OIDC_TENANT_ID}/oauth2/v2.0/authorize"
export OIDC_TOKEN_ENDPOINT="https://login.microsoftonline.com/${NIJMEGEN_OIDC_TENANT_ID}/oauth2/v2.0/token"
export OIDC_USERINFO_ENDPOINT="https://graph.microsoft.com/oidc/userinfo"
export OIDC_TOKENINFO_ENDPOINT="https://$HHB_FRONTEND_DNS/auth/realms/hhb/protocol/openid-connect/token/introspect"

export CI_API_V4_URL=https://gitlab.com/api/v4
export CI_PROJECT_ID=20352213
export UNLEASH_INSTANCEID=JbZyPux6M7xwejsESy9L
export UNLEASH_APPNAME=huishoudboekje-frontend
export CUSTOMER_BUILD=nijmegen

# allways change password for databases 
export POSTGRESQL_PASSWORD="changeme"
export POSTGRESQL_PASSWORD_BKTSVC="changeme"
export POSTGRESQL_PASSWORD_GRBSVC="changeme"
export POSTGRESQL_PASSWORD_HHBSVC="changeme"
export POSTGRESQL_PASSWORD_LOGSVC="changeme"
export POSTGRESQL_PASSWORD_ORGSVC="changeme"

# allways change secret FOR JWT
export HHB_SECRET="changeme"
```

PRD environment change these variables

```bash
export HHB_HOST='huishoudboekje.nijmegen.nl'
export NAMESPACE='huishoudboekje'
```

Run script

We are using the gitlab docker images (so you need to be on a branch/commit that exists on gitlab).
Now you can generate the kustomize yaml file

```bash
sh k8s/build.sh
```

Run the commands shown at the end of the script

huishoudboekje will be deployed on your true-cluster
