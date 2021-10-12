# Deploy HHB in minikube

## TODO

What is not working yet, is to expose the website, more info on how to get this done: [link](https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/)

## Deploy huishoudboekje on minikube

Install minikube on your system. [link](https://minikube.sigs.k8s.io/docs/start/)

Start minikube and enable ingress:

```bash
minikube start
minikube addons enable ingress
```

Configure/Switch your kubectl to use minikube context

```bash
kubectl config use-context minikube
```

`k8s/build.sh` needs to know you are targeting minikube, so set this setting

```bash
export USE_PLATFORM='minikube'
```

We are using the gitlab docker images (so you need to be on a branch/commit that exists on gitlab).
Now you can generate the kustomize yaml file

```bash
sh k8s/build.sh
```

Execute the command that is showed at the end of the script

```bash
kubectl apply -f k8s/dist/namespace.yaml
kubectl apply -f k8s/dist/single_deploy_file.yaml --namespace=huishoudboekje
```

huishoudboekje will be deployed on your minikube
