# Take the name of the current branch and the short hash of the current commit
# from CI_COMMIT_REF_SLUG and CI_COMMIT_SHORT_SHA, or from git.
BRANCH_NAME=${CI_COMMIT_REF_SLUG:-$(git rev-parse --abbrev-ref HEAD)}
COMMIT_SHA=${CI_COMMIT_SHORT_SHA:-$(git rev-parse --short HEAD)}

# If use BRANCH_NAME and COMMIT_SHA as the IMAGE_TAG, you can override this by providing IMAGE_TAG.
export IMAGE_TAG=${IMAGE_TAG:-$BRANCH_NAME-$COMMIT_SHA}

# Use the provided NAMESPACE or "huishoudboekje" as the default.
export NAMESPACE=${NAMESPACE:-huishoudboekje}

# Use the provided HHB_HOST or "hhb.minikube" as the default.
export HHB_HOST=${HHB_HOST:-hhb.minikube}

# Create a temporary directory to put the dist files in.
export DEPLOYMENT_DIST_DIR="dist"

# Debugging
echo CI_COMMIT_REF_SLUG = $CI_COMMIT_REF_SLUG
echo CI_COMMIT_SHORT_SHA = $CI_COMMIT_SHORT_SHA
echo BRANCH_NAME = $BRANCH_NAME
echo COMMIT_SHA = $COMMIT_SHA
echo IMAGE_TAG = $IMAGE_TAG
echo NAMESPACE = $NAMESPACE
echo HHB_HOST = $HHB_HOST
echo DEPLOYMENT_DIST_DIR = $DEPLOYMENT_DIST_DIR

# Create directory to store the dist files for the deployment in
mkdir -p k8s/$DEPLOYMENT_DIST_DIR
cd k8s

# Find all .yaml-files in the base directory and replace the envvars
for i in `find ./base -name "*.yaml" | cut -f3-4 -d'/'`
do
  echo "Applying envvars on $i..."
  mkdir -p `dirname $DEPLOYMENT_DIST_DIR/$i`
  envsubst < ./base/$i > $DEPLOYMENT_DIST_DIR/$i
done

echo "You will find your files in $DEPLOYMENT_DIST_DIR. To deploy, just run kubectl apply -k $DEPLOYMENT_DIST_DIR."

# Apply the whole Kustomize at once
#kubectl apply -k $DEPLOYMENT_DIST_DIR

# Delete the temporary directory
#rm -rf "${DEPLOYMENT_DIST_DIR}"
#echo Deleted temporary directory $DEPLOYMENT_DIST_DIR
