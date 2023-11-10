---
"huishoudboekje": minor
---

The authservice now uses a redis session store instead of storing this in cookies.

⚠️ This requires a Redis database to connect to.
⚠️ The authservice will need ENV variable REDIS_AUTH_PASSWORD that contains the conenction url to connect to the redis database.
