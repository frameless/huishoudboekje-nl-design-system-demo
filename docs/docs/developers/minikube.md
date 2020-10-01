---
id: minikube
title: Minikube
---

# Running the complete stack using Minikube

## 0. Prerequisites

Make sure you have installed the following tools:

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- [helm](https://helm.sh/docs/intro/)

## 1. Setup minikube on your local development machine.

Read the [minikube README](https://github.com/kubernetes/minikube) for more information.

### Configure the vm driver for minikube:

- for Linux: `minikube config set vm-driver kvm2`
- for MacOs: `minikube config set vm-driver hyperkit`

For developers, it's advised to setup minikube with 4 cores, 8GB RAM and at least 100G storage.
e.g.: `minikube start --cpus 4 --memory 8192 --disk-size=100G`

## 2. Add the minikube hostnames to your machine's resolver so you can reach the services from your browser.

> see https://github.com/kubernetes/minikube/tree/master/deploy/addons/ingress-dns

```bash
minikube addons enable ingress-dns
```

On MacOS, create a resolver file for Minikube:

```bash
sudo mkdir -p /etc/resolver
```

And add the following content to `/etc/resolver/minikube`:

```shell script
sudo tee /etc/resolver/minikube <<EOF
nameserver $(minikube ip)
search_order 1
timeout 5
EOF
```

## 3. Configure docker env in shell

To let the docker commands make use of Minikube execute the following before proceeding or add it to your shell profile:

```shell script
eval $(minikube docker-env)
```

## 4. Install Traefik ingress controller

Once minikube is running, install Traefik as ingress controller for web and rest-api requests.

```shell script
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm repo update

helm install traefik traefik/traefik --namespace traefik --create-namespace --values helm/traefik-values-minikube.yaml
```

## 5. Build and install Huishoudboekje components

When Traefik is running, you can build and start all the HHB components by executing the make command in the Huishoudboekje repository root:

```shell script
make
```


## 6. You may now test the following sites:

- http://traefik.minikube:9000/                     Webinterface showing the status of the traefik ingress controller
- http://hhb.minikube/                              Huishoudboekje frontend

Other connection options can be discovered using
```shell script
helm status --namespace huishoudboekje huishoudboekje
```
