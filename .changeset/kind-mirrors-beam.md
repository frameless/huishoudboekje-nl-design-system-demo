---
"huishoudboekje": minor
---

Fixed #879: Feature flags are now following OTAP, and can be enabled per environment type.

### Migration

Please add the following enviroment variables to the Unleash service:

```shell
# For production environment
UNLEASH_OTAP = production

# For acceptance environment
UNLEASH_OTAP = acceptance
```