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
```shell script
cd backend
conda env create -f /path/to/environment.yml
cd app
export OIDC_REDIRECT_URI=http://localhost:3000/api/oidc_callback
./main.py
```

### Applicatie Component (Medewerkers)
```shell script
cd frontend/app
npm install
npm start
``` 
