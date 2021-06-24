import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client/core";
import {BatchHttpLink} from "@apollo/client/link/batch-http";
import {createUploadLink} from "apollo-upload-client";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const graphQlApiUrl = process.env.GRAPHQL_API_URL;
const authBearer = process.env.PROXY_AUTHORIZATION;

if (!graphQlApiUrl) {
	throw new Error("GRAPHQL_API_URL not set.");
}

const headers = {
	...authBearer && {
		"Authorization": `Bearer ${authBearer}`,
	},
};

const defaultLink = new BatchHttpLink({
	uri: graphQlApiUrl,
	batchMax: 50,
	batchInterval: 500,
	batchDebounce: true,
	fetch: fetch,
	headers,
});

const uploadLink = createUploadLink({
	uri: graphQlApiUrl,
	fetch: fetch,
	headers,
});

const apolloClient = new ApolloClient({
	ssrMode: true,
	credentials: "include",
	cache: new InMemoryCache({
		resultCaching: false,
	}),
	link: ApolloLink.split(
		(operation) => operation.getContext().method === "fileUpload",
		uploadLink,
		defaultLink,
	),
	defaultOptions: {
		query: {
			fetchPolicy: "no-cache",
			errorPolicy: "all",
		},
	},
});

export default apolloClient;