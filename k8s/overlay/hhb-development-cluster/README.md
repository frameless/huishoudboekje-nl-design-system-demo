> ⚠️ Notice: This is the way we deploy Huishoudboekje onto our review cluster.
> For production, we recommend using [Helm charts that have been
> provided by the community](https://gitlab.com/commonground/huishoudboekje/helm-charts).

# Kubernetes Configuration

This readme describes how to deploy Huishoudboekje as an application to be reviewed on a Kubernetes cluster through
GitLab. It is recommended to have at least some knowledge of the following techniques:

- [Kubernetes](https://kubernetes.io/)
- [Kustomize](https://kustomize.io/)

### Advantages

- You can use Kustomize with your Kubernetes cluster out of the box. No need to install plugins or modules.

We use Kustomize for our deploys in Kubernetes. Kustomize uses so called patches to change the base yaml files with the correct values. It is reccomended to create an overlay for each environment that you want to deploy on. For each environment you should create patches with the corerct values. 

### [Base](./base)

All components within Huishoudboekje have their own directory in [base](./base) with YAML-files that contain all the
shared configurations for that component.

### [Overlay](./overlay)

This is where customizations are made for a specific environment.

### [Components](./components)

Components are patches that can be used in more then one overlay.

#### [hhb-development-cluster/test](./overlay/cluster/prod)

This contains all the patches for deploying our test environment. 

#### [hhb-development-cluster/review](./overlay/cluster/review)

This contains all the patches for deploying to our review cluster. 

When deploying to our clusters not all values are known in advance since we deploy using gitlab pipelines. There are multiple solutions to dynamically change values, we have chosen to use environment variables. Where needed we created sample.*.yaml files. These files are used to generate the required yaml files.

## Step 1: Set env variables
Settings regarding the type of Kubernetes-platform and application theming are configurable. This is why we build the configuration files first, before actually applying them to a cluster.

All environment variables that must be set to perform a successful build and deploy. Basically all settings have default values, which means that setting the right variables can be done using one command.

We set variables in four kustomization files.
 - components/configmaps/sample.kustomization.yaml
 - components/set-images/sample.kustomization.yaml
 - review/sample.ingress-host-patch.yaml
 - review/sample.ingress-sb-host-patch.yaml

We use two clusters, however, we set the required env variables for both clusters using the same script: [apply-env-vars.sh](./apply-env-vars.sh).

To set env variables, run the following command:

```shell
sh k8s/overlay/hhb-development-cluser/apply-env-vars.sh
```

This will generate the necessary kustomization YAML-files.


### Building for a Haven compliant cluster

To deploy from GitLab, you need letsencrypt (prod/components/lets-encrypt) and at least the following environment variables:

```shell
APP_HOST="huishoudboekje.example.com"
NAMESPACE="my-namespace"
OIDC_BASE_URL="https://huishoudboekje.example.com"
OIDC_ISSUER_URL="https://your-oidc-provider"
OIDC_CLIENT_ID="huishoudboekje"
JWT_ISSUER="your-issuer"
JWT_AUDIENCE="your-issuer"
JWT_SECRET="your-jwt-secret"
```

We use [Docker images that are hosted on our own GitLab Image Repository](https://gitlab.com/commonground/huishoudboekje/app-new/container_registry), so please make sure you are on an
existing branch. Now you can generate the kustomize YAML files by running the build script.

## Step 2: Deploying

Deploy Huishoudboekje with these commands:

```shell
# To check if the right files and values are being created run.
kubectl kustomize ./k8s/overlay/hhb-development-cluster/review

# Create the namespace if it doesn't exist yet.
kubectl create namespace $NAMESPACE

#deploy
kubectl apply -k ./k8s/overlay/hhb-development-cluster/review --namespace=$NAMESPACE
```

Huishoudboekje will now run on your Kubernetes cluster.
