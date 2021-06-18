import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client/core";
import {BatchHttpLink} from "@apollo/client/link/batch-http";
import {createUploadLink} from "apollo-upload-client";
import fetch from "node-fetch";

const baseURL = "http://localhost:3000";
const GraphqlApiUrl = baseURL + "/api/graphql";
const GraphqlApiUrlUpload = baseURL + "/api/graphql";

const defaultLink = new BatchHttpLink({
	uri: GraphqlApiUrl,
	batchMax: 50,
	batchInterval: 500,
	batchDebounce: true,
	fetch: fetch,
});

const uploadLink = createUploadLink({
	uri: GraphqlApiUrlUpload,
});

const apolloClient = new ApolloClient({
	cache: new InMemoryCache({
		resultCaching: false
	}),
	link: ApolloLink.split(
		(operation) => operation.getContext().method === "fileUpload",
		uploadLink,
		defaultLink,
	),
	defaultOptions: {
		query: {
			fetchPolicy: "no-cache",
			errorPolicy: "all"
		}
	}
});

export default apolloClient;