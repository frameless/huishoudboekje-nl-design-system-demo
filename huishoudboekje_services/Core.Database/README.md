# Core.Database
This project contains the common logic to communicate with databases that is used in all huishoudboekje services.

## Env variables
The environment variables used to configure the database are:
- **HHB_DATABASE_URL** : The url to connect to the database

## Framework
To communicate to a database and execute queries easily a framework is needed. The chosen framework is [entity framework core](https://learn.microsoft.com/en-us/ef/core/).
Entity framework core provides for all the necessary functionality, like connection with the database, query execution and migrations.

## Description
Communication to a database is done in the same way for all the microservices.
This project contains generic code to execute the most commonly used database functionalities.
This makes it easy to set up or expand microservices.

The database logic is structured with the use of repositories. Each table in a database has its own repository.
These repositories implement the base repository. To implement the base repository a DatabaseModel is required.
The DatabaseModel represents a table from the database.
The base repository contains the logic to execute "Commands" to get data from a table (DatabaseModel).

The base repository uses the [Command pattern](https://refactoring.guru/design-patterns/command).
A repository executes commands to interact with the database. Each command is an action that can be performed on a database table.
For example, "InsertRecord", "GetAll", "GetById" are all actions that most microservices perform on most tables.

By using these commands its easy to add new logic to a microservice. However sometimes these commands are not specific enough.
to prevent many similar commands, the [Decorator Pattern](https://refactoring.guru/design-patterns/decorator) is used.
This allows for small modifications to a command. For example pagination, this is frequently done to actions that result in long lists of data.
This would result in situations like like "GetAll" and "GetAllPaged" for small additions.
Instead of a new command the PagedCommandDecorator can be used to add the pagination to a command when required.

## Extension
The AddDatabaseContextExtension is used to add a database connection to a service. This makes sure that all services communicate to a database in the same way.



