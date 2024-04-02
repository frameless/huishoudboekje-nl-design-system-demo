# Mesh
To communicate to the hhb backend services all requests are made to the [Graphql mesh](https://the-guild.dev/graphql/mesh/docs). The mesh combines all the services into one graphql api.

## GraphQl
Because we are slowly removing the backend and replacing it with services we need to have the backend in the mesh. For this the mesh needs the schema from the backend during the build process. Since we want to build in the dockerfile this schema needs to be present. ⚠️⚠️ For now this schema needs to be added by hand to the mesh. ⚠️⚠️ It can generated locally by running `npm run get-backend-schema`, the backend needs to be running for this.

## GRPC
Some service are grpc api's. To make sure the graphql mesh knows what data can be requested it needs the `.proto` files. Execute the `copy-protos.sh` script to copy all the expected proto files into the location the mesh expects. **This has to be done before creating a docker image based on the dockerFiles.** Otherwise the proto files will not be included in the image and the mesh wont work as expected.

## Run the mesh
Two examples of how to run the mesh are locally or using docker-compose.

### Run locally
 - Make a .env file base on .env.sample
 - Execute `sh copy-protos.sh`
 - Execute `npm run dev`

### Run using dockercompose
 - Execute `sh copy-protos.sh` before running the docker-compose commands