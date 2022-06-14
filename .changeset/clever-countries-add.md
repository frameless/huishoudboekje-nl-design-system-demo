---
"huishoudboekje": minor
---

Updated the command for migrating the database schema.

## Migration guide
Please make the following changes to your deployment scripts:

### Postadressenservice
Change `npm run db:push` to `npm run db:deploy`.

### Alarmenservice
Change `npm run db:push` to `npm run db:deploy`.

### Signalenservice
Change `npm run db:push` to `npm run db:deploy`.