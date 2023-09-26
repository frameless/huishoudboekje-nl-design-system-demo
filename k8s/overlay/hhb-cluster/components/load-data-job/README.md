Make sure to have only the testdata in the database locally
To generate the databse dump tar files use the command: 

docker exec -it <docker-container id> pg_dump -U postgres -d <db name> -Ft --data-only > <filename>

example:
docker exec -it 32e408ce1c34 pg_dump -U postgres -d huishoudboekjeservice -Ft --data-only > huishoudboekje.tar

you can find the docker-container id using docker ps
