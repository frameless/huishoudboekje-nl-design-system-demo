---
"huishoudboekje": minor
---

#1076: A cronjob that checks alarms has been added.

## Migration guide

Please add the cronjob to your deployments. It should be scheduled to be executed some time at night, for example at 3am.
The container for the cronjob requires the same environment variables as the container for the backend.

```shell
HHB_SERVICE_URL="http://hhb-huishoudboekjeservice"
ORGANISATIE_SERVICE_URL="http://hhb-organisatieservice"
TRANSACTIE_SERVICE_URL="http://hhb-banktransactieservice"
GROOTBOEK_SERVICE_URL="http://hhb-grootboekservice"
LOG_SERVICE_URL="http://hhb-logservice"
POSTADRESSENSERVICE_URL="http://hhb-postadressenservice"
ALARMENSERVICE_URL="http://hhb-alarmenservice"
SIGNALENSERVICE_URL="http://hhb-signalenservice"
```

As the command inside the cronjob is a background job, no authorization is required. Authorization is disabled by adding the following environment variable to the container:

```shell
REQUIRE_AUTH="0"
```

See k8s/base/backend/cronjob.yaml in this repository for an example.
