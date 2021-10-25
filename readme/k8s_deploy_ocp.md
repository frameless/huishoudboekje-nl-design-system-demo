# Deploy HHB in OCP

Below is a description of the minimum you need to do to be able to deploy on the platform OCP. Description of all variables that can be set can be found here: [link](k8s_build_and_deploy.md)

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

Setup some environment variable (needs to know you are targeting ocp)

```bash
export HHB_HOST='openshift.hhb.nl'
export HHB_APP_HOST='apps.hhb.nl'
export USE_PLATFORM='ocp'
export HHB_FRONTEND_DNS="hhb-huishoudboekje.$HHB_APP_HOST"
export CI_API_V4_URL=https://gitlab.com/api/v4
export CI_PROJECT_ID=20352213
export UNLEASH_INSTANCEID=JbZyPux6M7xwejsESy9L
export UNLEASH_APPNAME=huishoudboekje-frontend
```

Run script

We are using the gitlab docker images (so you need to be on a branch/commit that exists on gitlab).
Now you can generate the kustomize yaml file

```bash
sh k8s/build.sh
```

Run the commands shown at the end of the script

huishoudboekje will be deployed on your ocp-cluster
