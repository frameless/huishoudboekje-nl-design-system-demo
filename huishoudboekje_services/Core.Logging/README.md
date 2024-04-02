# Core.Logging
This project contains the log interceptor for the grpc calls.
This will send all the requests and extra information to the LogService.

## Important information
The interceptor is set up to work for all calls. Therefore it expects a certain naming conventions in the proto files.

Entities that need to be logged should have an property called `Id` that has the uuid of that entity.
Lists of entities in for example a GetAll or GetPaged should be called `Data`.
