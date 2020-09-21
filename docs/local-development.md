## Requirements

- Anaconda
- Docker
- Node/NPM

### Local Identity Provider
```shell script
docker-compose -f ./docker-compose.dev.yaml up -d
```

### Medewerkers Proces Component

```shell script
cd backend
conda env create -f /path/to/environment.yml
cd app
./main.py
```

### Medewerkers Component

```shell script
cd frontend/app
npm install
npm start
``` 
