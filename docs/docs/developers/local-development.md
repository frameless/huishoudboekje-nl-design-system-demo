---
id: local-development
title: Local Development
---

## Requirements
- Anaconda
- Docker
- Node/NPM

### Local Identity Provider (optional)
```shell script
docker-compose -f ./docker-compose.dev.yaml up -d
```

### Proces Component (Medewerkers)

see `backend/README.md`

### Applicatie Component (Medewerkers)

```shell script
cd frontend/app
npm install
npm start
``` 
