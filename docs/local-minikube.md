### Running the complete stack using Minikube

Make sure you have installed the following tools:

- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
- [helm](https://helm.sh/docs/intro/)

Setup minikube on your local development machine.

Read the [minikube README](https://github.com/kubernetes/minikube) for more information.

Configure the vm driver for minikube:

- for Linux: `minikube config set vm-driver kvm2`
- for Mac: `minikube config set vm-driver hyperkit`

For developers, it's advised to setup minikube with 4 cores, 8GB RAM and at least 100G storage.
e.g.: `minikube start --cpus 4 --memory 8192 --disk-size=100G`


Add the minikube hostnames to your machine's resolver so you can reach the services from your browser.

> see https://github.com/kubernetes/minikube/tree/master/deploy/addons/ingress-dns

```bash
minikube addons enable ingress-dns
```

On MacOS:

```bash
sudo mkdir -p /etc/resolver
sudo tee /etc/resolver/minikube <<EOF
nameserver $(minikube ip)
search_order 1
timeout 5
EOF
```

To let the docker commands make use of Minikube execute the following before proceeding or add it to your shell profile:

```bash
eval $(minikube docker-env)
```

Once minikube is running, install Traefik as ingress controller for web and rest-api requests.

```bash
helm repo add traefik https://containous.github.io/traefik-helm-chart
helm repo update

helm install traefik traefik/traefik --namespace traefik --create-namespace --values helm/traefik-values-minikube.yaml
```

When Traefik is running, you can build and start all the HHB components by executing:

```bash
make
```

You may now test the following sites:

- http://traefik.minikube:9000/                     Webinterface showing the status of the traefik ingress controller
- http://hhb.minikube/                              Huishoudboekje frontend
