Generic single-database configuration.

TODO documentation
- how does this work
- how to add migrations
- how is it invoked
  - development
  - production
  
## How to add migrations

1. Change the model files
1. Execute the following command to generate a script with the up and down migrations in it
```shell script
python manage.py db revision --autogenerate -m '<message describing the change'
``` 
