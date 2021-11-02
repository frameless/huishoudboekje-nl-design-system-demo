# Kubernetes deploy configuration

Here will be described how the deploy files in the directory k8s are put together.

## Build

We use Kustomize for our deploys in k8s. We support different platforms, which are explained below in `Deploy`.

The structure of the directories is divided into a few parts.

### Directory k8s/base

Here all components are separate from each other and all have a separate Kustomization.yaml. It contains all the resources of that component

### Directory k8s/customer

Here are the customers of `huishoudboekje` with their own Kustomization.yaml in which reference is made to the components they purchase and of course their own theme.

### Directory k8s/templates

For all files in this folder the files are transformed by means of `envsubst`. This means that `os-variable` can be used here. Note this if you want to use the `$` sign.

* templates/env_patch.yaml -> project variable which will be different for each deploy environment
* templates/secrets.yaml -> secrets in project variable, this can optionally be included with build.sh

Each "platform" should have the following template files. These can be empty, but the files must be there (build script expects them)

* templates/platform/[platform-name]/add.yaml -> will be added as a resource [example](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/mySql/README.md#add-the-resources)
* templates/platform/[platform-name]/patch.yaml -> will be added as a (merge)patch [example](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/#customizing)

## Deploy

Running releases manually is possible for the following platforms

### OCP

link to [OCP](k8s_deploy_ocp.md)

### TRUE

link to [TRUE](k8s_deploy_true.md)

### MiniKube

link to [MiniKube](k8s_deploy_minikube.md)
