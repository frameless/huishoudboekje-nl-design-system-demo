# Deploy HHB in OCP

## Deploy huishoudboekje on OCP

Configure OCP in kubectl.

Login to you OCP console, for example `https://openshift.hhb.nl/`. Copy your token from "Copy Login Command". Put your token in a file, for example ~/token_ocp.txt.

Create a new namespace with the name `huishoudboekje` (Create Project)

Now we can setup kubectl login, example for user: username, namespace: huishoudboekje

```bash
token=$(<~/token_ocp.txt)
kubectl config set-credentials username/openshift.hhb.nl --token=$token
kubectl config set-cluster openshift.hhb.nl --insecure-skip-tls-verify=true --server=https://openshift.hhb.nl
kubectl config set-context huishoudboekje/openshift.hhb.nl/username --user=username/openshift.hhb.nl--namespace=huishoudboekje --cluster=openshift.hhb.nl
kubectl config use-context huishoudboekje/openshift.hhb.nl/username
```

Setup some environment variable

```bash
export HHB_HOST='openshift.hhb.nl'
export HHB_APP_HOST='apps.hhb.nl'
export USE_PLATFORM='ocp'
export STORAGECLASSNAME='glusterfs-storage'
export HHB_FRONTEND_DNS="hhb-huishoudboekje.$HHB_APP_HOST"
export HHB_FRONTEND_ENDPOINT="https://$HHB_FRONTEND_DNS"
export HHB_API_ENDPOINT="$HHB_FRONTEND_ENDPOINT/api"
export AUTH_AUDIENCE="$HHB_FRONTEND_ENDPOINT"
export HHB_DEX_DNS="dex-huishoudboekje.$HHB_APP_HOST"
export HHB_DEX_ENDPOINT="https://$HHB_DEX_DNS"
```

`k8s/build.sh` needs to know you are targeting ocp, so set this setting

```bash
export USE_PLATFORM='ocp'
```

We are using the gitlab docker images (so you need to be on a branch/commit that exists on gitlab).
Now you can generate the kustomize yaml file

```bash
sh k8s/build.sh
```

Execute the command that is showed at the end of the script

```bash
kubectl apply -f k8s/dist/single_deploy_file.yaml --namespace=huishoudboekje
```

huishoudboekje will be deployed on your ocp
