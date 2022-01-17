# Kubernetes Deploy Configuration
This readme describes how to deploy Huishoudboekje as an application on a Kubernetes cluster.

It is recommended to have at least some knowledge of the following techniques:
- [Kubernetes](https://kubernetes.io/)
- [Kustomize](https://kustomize.io/)

### Advantages
- You can use Kustomize with your Kubernetes-cluster out of the box. No need to install plugins or modules.

## Step 1: Building the configuration files
We use Kustomize for our deploys in Kubernetes. Settings regarding the type of Kubernetes-platform and application theming are configurable.
This is why we build the configuration files first, before actually applying them to the Kubernetes-cluster.

All environment variables that must be set to perform a successful build can be found in the [build.sh](./build.sh).
Basically all settings have default values, which means that building the correct configuration can be done using one command.

To build a configuration, run the following command:
```shell
sh k8s/build.sh
```
A series of YAML-files will be created in the [distribution directory](./dist).

### [Base](./base)
All components within Huishoudboekje have their own directory in [base](./base) with YAML-files that contain all the shared configurations for that component.

### [Customer](./customer)
Huishoudboekje currently includes themes for Gemeente Sloothuizen (for demonstration purposes) and for Gemeente Nijmegen.
This is where a custom theme can be installed.

### [Templates](./templates)
All files in this directory are processed using `envsubst`. This means that you can set environment variables to change the configuration.

We have a default set of configurations for various environments, including:
- Our own review applications and our demonstration environments
- [Haven compliant Kubernetes clusters](https://haven.commonground.nl/)
- [OpenShift Container Platform](https://www.redhat.com/en/technologies/cloud-computing/openshift)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) for local development

Each platform should have the following files. These can be empty, but the build script expects these files to be there.
- `templates/platform/[your-platform]/add.yaml`
- `templates/platform/[your-platform]/patch.yaml`

[add.yaml example](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/mySql/README.md#add-the-resources)
[patch.yaml example](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/#customizing)

### Building for Minikube
The build script needs to know you are targeting Minikube, therefor, we need the following environment variables:

```bash
export USE_PLATFORM="minikube"
export HHB_HOST="hhb.minikube"
export NAMESPACE="huishoudboekje"

# We don't use SSL locally, so we use http.
export HHB_FRONTEND_ENDPOINT="http://${HHB_HOST}"
export OIDC_ISSUER="http://$HHB_HOST/auth"
export OIDC_AUTHORIZATION_ENDPOINT="http://${HHB_HOST}/auth/auth"
export OIDC_TOKEN_ENDPOINT="http://${HHB_HOST}/auth/token"
export OIDC_TOKENINFO_ENDPOINT="http://${HHB_HOST}/auth/tokeninfo"
export OIDC_USERINFO_ENDPOINT="http://${HHB_HOST}/auth/userinfo"

export CI_API_V4_URL="https://gitlab.com/api/v4"
export CI_PROJECT_ID="20352213"
export UNLEASH_INSTANCEID="JbZyPux6M7xwejsESy9L"
export UNLEASH_APPNAME="huishoudboekje-frontend"
```

We are using Docker images that are hosted on our own GitLab Image Repository, so please make sure you are on an existing branch.
Now you can generate the kustomize YAML-files by running the build script.

```bash
sh k8s/build.sh
```

You will find the YAML-files with the Kubernetes-configuration in the `dist` directory.

### Building for a Haven-compliant cluster
The build script needs to know you are targeting True, therefor, we need the following environment variables.
In this case, the example is for Gemeente Nijmegen.

```bash
export USE_PLATFORM="true"
export HHB_HOST="huishoudboekje-accp.nijmegen.nl" # huishoudboekje.nijmegen.nl for production
export NAMESPACE="huishoudboekje-acc" # huishoudboekje for production
export CERT_MANAGER_ISSUER="letsencrypt-prod"

# We use login.microsoftonline.com
export NIJMEGEN_OIDC_TENANT_ID="changeme"
export OIDC_CLIENT_ID="changeme"
export OIDC_CLIENT_SECRET="changeme"
export OIDC_ISSUER="https://login.microsoftonline.com/${NIJMEGEN_OIDC_TENANT_ID}/v2.0"
export OIDC_AUTHORIZATION_ENDPOINT="https://login.microsoftonline.com/${NIJMEGEN_OIDC_TENANT_ID}/oauth2/v2.0/authorize"
export OIDC_TOKEN_ENDPOINT="https://login.microsoftonline.com/${NIJMEGEN_OIDC_TENANT_ID}/oauth2/v2.0/token"
export OIDC_USERINFO_ENDPOINT="https://graph.microsoft.com/oidc/userinfo"
export OIDC_TOKENINFO_ENDPOINT="https://$HHB_FRONTEND_DNS/auth/realms/hhb/protocol/openid-connect/token/introspect"

export CI_API_V4_URL="https://gitlab.com/api/v4"
export CI_PROJECT_ID="20352213"
export UNLEASH_INSTANCEID="JbZyPux6M7xwejsESy9L"
export UNLEASH_APPNAME="huishoudboekje-frontend"
export CUSTOMER_BUILD="nijmegen"

# It is recommended to change the passwords for the PostgreSQL Databases.
export POSTGRESQL_PASSWORD="changeme"
export POSTGRESQL_PASSWORD_BKTSVC="changeme"
export POSTGRESQL_PASSWORD_GRBSVC="changeme"
export POSTGRESQL_PASSWORD_HHBSVC="changeme"
export POSTGRESQL_PASSWORD_LOGSVC="changeme"
export POSTGRESQL_PASSWORD_ORGSVC="changeme"
export POSTGRESQL_PASSWORD_PADSVC="changeme"
export POSTGRESQL_PASSWORD_ALMSVC="changeme"
export POSTGRESQL_PASSWORD_SIGSVC="changeme"

export KEYCLOAK_DB_PASSWORD="changeme"

# allways change secret FOR JWT
export HHB_SECRET="changeme"
```

We are using Docker images that are hosted on our own GitLab Image Repository, so please make sure you are on an existing branch.
Now you can generate the kustomize YAML-files by running the build script.

```bash
sh k8s/build.sh
```

You will find the YAML-files with the Kubernetes-configuration in the `dist` directory.

### Building for on OpenShift Container Platform.

#### Configure OCP in kubectl.
1. Login to your OCP console, for example `https://openshift.example.com/`. 
2. Copy your token from `Copy Login Command`. Save your token in `~/token_ocp.txt`.
3. Create a new namespace with the name `huishoudboekje` (Create Project)
4. Follow the steps below to setup `kubectl`.

```shell
TOKEN=$(cat ~/token_ocp.txt)
kubectl config set-credentials username/openshift.example.com --token=$TOKEN
kubectl config set-cluster openshift.example.com --insecure-skip-tls-verify=true --server=https://openshift.example.com
kubectl config set-context huishoudboekje/openshift.example.com/username --user=username/openshift.example.com--namespace=huishoudboekje --cluster=openshift.example.com
kubectl config use-context huishoudboekje/openshift.example.com/username
```

The build script needs to know you are targeting OpenShift, therefor, we need the following environment variables:

```bash
export USE_PLATFORM="ocp"
export HHB_HOST="openshift.example.com"
export HHB_APP_HOST="apps.example.com"
export HHB_FRONTEND_DNS="hhb-huishoudboekje.$HHB_APP_HOST"
export CI_API_V4_URL="https://gitlab.com/api/v4"
export CI_PROJECT_ID="20352213"
export UNLEASH_INSTANCEID="JbZyPux6M7xwejsESy9L"
export UNLEASH_APPNAME="huishoudboekje-frontend"
```

We are using Docker images that are hosted on our own GitLab Image Repository, so please make sure you are on an existing branch.
Now you can generate the kustomize YAML-files by running the build script.

```bash
sh k8s/build.sh
```

You will find the YAML-files with the Kubernetes-configuration in the `dist` directory.


## Step 2: Deploying
Deploying Huishoudboekje manually can be done by running the following commands:

```shell
# Create the namespace if it doesn't exist yet.
kubectl apply -f k8s/dist/namespace.yaml
 
# Run the deploy script.
sh k8s/deploy.sh
```

You now have Huishoudboekje running on your cluster.