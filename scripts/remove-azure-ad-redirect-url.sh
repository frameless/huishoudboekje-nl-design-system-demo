#!/bin/bash

# Usage: ./remove-azure-ad-redirect-url.sh <your-app-id> <your-target-url>

# Check if both parameters are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <your-app-id> <your-target-url>"
  exit 1
fi

app_id="$1"
target_url="$2"

# Get the list of redirect URLs
redirect_urls=$(az ad app show --id $app_id --query "web.redirectUris" --output json)

# Find the index of the target URL in the list
index=$(echo $redirect_urls | jq -r ". | index(\"$target_url\")")

if [ "$index" != "null" ]; then
  echo "Index of $target_url: $index"
  echo "Removing url..."
  az ad app update --id $app_id --remove replyUrls 1
  echo "Removed url"
else
  echo "URL not found"
  exit 2
fi