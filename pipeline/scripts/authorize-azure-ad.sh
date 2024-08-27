function set_variable {
    RESPONSE=$(curl --silent --write-out "HTTPSTATUS:%{http_code}"\
        --request POST "$GITLAB_API_URL/projects/$CI_PROJECT_ID/variables" \
        --header "PRIVATE-TOKEN: $GITLAB_ACCESS_TOKEN" \
        --form "key=$1" \
        --form "value=$2"\
        --form "masked=true"\
        --form "description=pipeline-generated-value"\
        --form "environment_scope=$EVIRONMENT_NAME")
    
    HTTP_STATUS=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    if [ "$HTTP_STATUS" -ne 201 ]; then
        echo "Error setting variable: $1"
        exit 1
    fi
}

# If variables already exist in this environment app should not be created again
if [ -n "$AZURE_APP_SCOPE" ] && [ -n "$AZURE_APP_ID" ] && [ -n "$AZURE_APP_SECRET" ]; then
    echo "All variables are set"
    exit 0
fi

# Login
az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID

# Exit if app already exists (checking vars before should prevent this from getting here but just in case)
EXISTING_APP_ID=$(az ad app list --filter "displayName eq '$CI_COMMIT_REF_SLUG'" --query "[0].appId" -o tsv)
if [ -n "$EXISTING_APP_ID" ]; 
then 
    echo "App already exits"
    exit 0
fi;

# Create app
APP_ID=$(az ad app create --display-name "$CI_COMMIT_REF_SLUG"\
    --identifier-uris "$APP_API_URI" \
    --web-redirect-uris "https://$APP_HOST/auth/callback"\
    --app-roles @pipeline/azure-deployment/appRoles.json \
    --query appId -o tsv)

# Set app required-resource-accesses correctly
REQUIRED_RESOURCE_ACCESS_JSON=$(cat "pipeline/azure-deployment/requireResource.json" | sed "s/PLACEHOLDER_APP_ID/$APP_ID/g" | sed "s/PLACEHOLDER_PERMISSON_ID/$PERMISSON_ID/g")
az ad app update --id "$APP_ID" --required-resource-accesses "$REQUIRED_RESOURCE_ACCESS_JSON"

# Set app api json correctly
export CUSTOM_API_JSON=$(cat "pipeline/azure-deployment/api.json" | sed "s/PLACEHOLDER_PERMISSON_ID/$PERMISSON_ID/g")
az ad app update --id "$APP_ID" --set api="$CUSTOM_API_JSON"

# Generate app secret
APP_SECRET=$(az ad app credential reset --id "$APP_ID" --query "password" -o tsv); 

# Set variables
set_variable AZURE_APP_SCOPE $APP_API_URI/default
set_variable AZURE_APP_ID $APP_ID
set_variable AZURE_APP_SECRET $APP_SECRET