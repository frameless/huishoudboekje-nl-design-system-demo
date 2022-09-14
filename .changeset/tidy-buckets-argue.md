---
"huishoudboekje": minor
---

Updated to Flask 2.

## Migration guide

The way that services migrate their databases has changed. 
In your deployment scripts, please find every instance of the following command:

```shell
python manage.py db upgrade
```

And change it to the following command:

```shell
flask db upgrade
```

To see the exact change in the context of a Kubernetes configuration file, please see `/k8s/base/organisatieservice/deployment.yaml`, lines 69-70.
