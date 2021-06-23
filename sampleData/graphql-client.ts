import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client/core";
import {BatchHttpLink} from "@apollo/client/link/batch-http";
import {createUploadLink} from "apollo-upload-client";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const baseURL = process.env.BASE_URL || "http://localhost:3000";
const authBearer = process.env.PROXY_AUTHORIZATION;

if (!baseURL) {
	throw new Error("BASE_URL not set.");
}

const GraphqlApiUrl = baseURL + "/api/graphql/";
const GraphqlApiUrlUpload = baseURL + "/api/graphql/";
const headers = {
	...authBearer && {
		"Authorization": `Bearer ${authBearer}`,
	},
};

const defaultLink = new BatchHttpLink({
	uri: GraphqlApiUrl,
	batchMax: 50,
	batchInterval: 500,
	batchDebounce: true,
	fetch: fetch,
	headers,
});

const uploadLink = createUploadLink({
	uri: GraphqlApiUrlUpload,
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