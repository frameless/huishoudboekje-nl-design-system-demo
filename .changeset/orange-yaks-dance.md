---
"huishoudboekje": patch
---

Fixed #742: All services now use a pre ping to determine if the connection with the database is still up. If not, a new connection will be made.
