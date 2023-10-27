---
"huishoudboekje": patch
---

Made the gunicron server better configurable in the services (not the backend). 

⚠️⚠️⚠️ GUNICORN_THREADS should be 1 (new default), there are new ENV variables added but its recommended to use the default values. If you want to changes some settings see the gunicorn.conf.py and the gunicorn documentation.