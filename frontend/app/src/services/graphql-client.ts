import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client";
import {BatchHttpLink} from "@apollo/client/link/batch-http";
import {createUploadLink} from "apollo-upload-client";

const GraphqlApiUrl = "/api/graphql";
const GraphqlApiUrlUpload = "/api/graphql";

const defaultLink = new BatchHttpLink({
	uri: GraphqlApiUrl,
	batchMax: 20,
	batchInterval: 250,
	batchDebounce: true,
});

const uploadLink = createUploadLink({
	uri: GraphqlApiUrlUpload,
});

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLink.split(
		(operation) => operation.getContext().method === "fileUpload",
		uploadLink,
		defaultLink,
	),
});

export default apolloClient;