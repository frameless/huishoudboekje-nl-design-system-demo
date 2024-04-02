#!/bin/sh

# Check if required environment variables are set
if [ -z "$EXCHANGE" ] || [ -z "$ROUTING_KEY" ] || [ -z "$MESSAGE" ]; then
  echo "Please set the required environment variables: EXCHANGE, ROUTING_KEY, MESSAGE"
  exit 1
fi

ENCODED_MESSAGE=$(echo -n "$MESSAGE" | base64)

curl -i -u "$HHB_RABBITMQ_USER:$HHB_RABBITMQ_PASS" \
     -H "content-type:application/json" \
     -X POST \
     -d "{\"properties\":{},\"routing_key\":\"$ROUTING_KEY\",\"payload\":\"$ENCODED_MESSAGE\",\"payload_encoding\":\"base64\"}" \
     "http://$HHB_RABBITMQ_HOST:$HHB_RABBITMQ_PORT/api/exchanges/%2F/$EXCHANGE/publish"
