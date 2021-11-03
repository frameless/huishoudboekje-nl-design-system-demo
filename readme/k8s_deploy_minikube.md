# Deploy HHB in minikube

Below is a description of the minimum you need to do to be able to deploy on the platform minikube. Description of all variables that can be set can be found here: [link](k8s_build_and_deploy.md)

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
export HHB_HOST='hhb.minikube'
export NAMESPACE='huishoudboekje'

# http not https
export HHB_FRONTEND_ENDPOINT="http://${HHB_HOST}"
export OIDC_ISSUER="http://$HHB_HOST/auth"
export OIDC_AUTHORIZATION_ENDPOINT="http://${HHB_HOST}/auth/auth"
export OIDC_TOKEN_ENDPOINT="http://hhb-dex/auth/token"
export OIDC_TOKENINFO_ENDPOINT="http://hhb-dex/auth/tokeninfo"
export OIDC_USERINFO_ENDPOINT="http://hhb-dex/auth/userinfo"

export CI_API_V4_URL=https://gitlab.com/api/v4
export CI_PROJECT_ID=20352213
export UNLEASH_INSTANCEID=JbZyPux6M7xwejsESy9L
export UNLEASH_APPNAME=huishoudboekje-frontend
```

We are using the gitlab docker images (so you need to be on a branch/commit that exists on gitlab).
Now you can generate the kustomize yaml file

```bash
sh k8s/build.sh
```

Run the commands shown at the end of the script

huishoudboekje will be deployed on your minikube

## Changes to local machine

We use a non-existent DNS, which does not point to the cluster. We still have to adjust this on the machine itself. Get the ip (external) address of your cluster first. You can do this with the following command: `kubectl get ingress --all-namespaces`. Now let's assume it's `172.17.0.2`.

Add the following line to your hosts file. For windows found here `c:\Windows\System32\Drivers\etc\hosts`, for linux here `/etc/hosts`.

line:

```ini
172.17.0.2 hhb.minikube
```

You can now go to [http://hhb.minikube](http://hhb.minikube), just remember to stay on http. There is no SSL certificate.
