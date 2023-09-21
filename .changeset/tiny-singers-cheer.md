---
"huishoudboekje": patch
---

Added ENV variables INTERNAL_CONNECTION_TIMEOUT and INTERNAL_READ_TIMEOUT to the backend. These ENV variables are used to set the timeout value (in seconds) for the get requests used inside the application. The default values are 10 and 30 (conenction and read). To set no timout set the value to 0.
