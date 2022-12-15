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

## Step 1: Building the configuration files

We use Kustomize for our deploys in Kubernetes. Settings regarding the type of Kubernetes-platform and application
theming are configurable. This is why we build the configuration files first, before actually applying them to a
cluster.

All environment variables that must be set to perform a successful build can be found in the [build.sh](./build.sh).
Basically all settings have default values, which means that building the correct configuration can be done using one
command.

To build a configuration, run the following command:

```shell
sh k8s/build.sh
```

A series of YAML-files will be created in the [distribution directory](./dist).

### [Base](./base)

All components within Huishoudboekje have their own directory in [base](./base) with YAML-files that contain all the
shared configurations for that component.

### [Overlay](./overlay)

This is where customizations are made for a specific environment. For example for using Let's Encrypt.

### [Templates](./templates)

All files in this directory are processed using `envsubst`. This means that you can set environment variables to change
the configuration.

We have a default set of configurations for various environments, including:

- Our own review applications and our demonstration environments
- [Haven compliant Kubernetes clusters](https://haven.commonground.nl/)

This method uses Docker containers that are hosted on [our own
GitLab Container Repository](https://gitlab.com/commonground/huishoudboekje/app-new/container_registry).

Now you can generate the kustomize YAML-files by running the build script.

```shell
sh k8s/build.sh
```

You will find the YAML-files with the Kubernetes-configuration in the `dist` directory.

### Building for a Haven compliant cluster

To deploy from GitLab, you need at least the following environment variables:

```shell
APP_HOST="huishoudboekje.example.com"
NAMESPACE="my-namespace"
USE_LETSENCRYPT="1"
OIDC_BASE_URL="https://huishoudboekje.example.com"
OIDC_ISSUER_URL="https://your-oidc-provider"
OIDC_CLIENT_ID="huishoudboekje"
JWT_ISSUER="your-issuer"
JWT_AUDIENCE="your-issuer"
JWT_SECRET="your-jwt-secret"
```

We use [Docker images that are hosted on our own GitLab Image Repository](https://gitlab.com/commonground/huishoudboekje/app-new/container_registry), so please make sure you are on an
existing branch. Now you can generate the kustomize YAML files by running the build script.

```shell
sh k8s/build.sh
```

You will find the YAML files with the Kubernetes configuration in the `dist` directory.

## Step 2: Deploying

Deploy Huishoudboekje with these commands:

```shell
# Create the namespace if it doesn't exist yet.
kubectl apply -f k8s/dist/namespace.yaml

# or
kubectl create namespace $NAMESPACE

# Run the deploy script.
sh k8s/deploy.sh
```

Huishoudboekje will now run on your Kubernetes cluster.
