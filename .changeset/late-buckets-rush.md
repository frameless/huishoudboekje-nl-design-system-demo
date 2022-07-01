---
"huishoudboekje": patch
---

Removed complexity from configuration and made logging easier configurable.

## Migration guide

We've made log levels configurable for every application. With no additional configuration, `LOG_LEVEL` is set to `info`. No debug messages will be logged.
If you wish to have more verbose logging you can set an environment variable `LOG_LEVEL` to `debug` for all of the services and backend:

```shell
LOG_LEVEL=debug
```
