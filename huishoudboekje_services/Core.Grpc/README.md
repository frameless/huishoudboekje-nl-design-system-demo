# Core.Grpc
This project contains the common logic to add a Grpc interface to a huishoudboekje service.

## Extension
The AddGrpcExtension is used to add the basic grpc functionality to a new service. This makes sure that all services implement it in the same way.
This also allows to easily add common functionalities to all services using interceptors.For example authentication is added using the AuthInterceptor.
