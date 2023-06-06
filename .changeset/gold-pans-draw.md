---
"huishoudboekje": patch
---

Added USE_GRAPHIQL environment variable for the backend that will determine the use of the graphiql interface. If set to "1" the interface will be enabled, otherwise disabled. Defaults to "0" on k8s and "1" for docker local development
