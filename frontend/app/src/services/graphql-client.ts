import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client";
import {BatchHttpLink} from "@apollo/client/link/batch-http";
import DebounceLink from "apollo-link-debounce";
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

const debounceLink = new DebounceLink(500);

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLink.from([
		debounceLink,
		ApolloLink.split(
			(operation) => operation.getContext().method === "fileUpload",
			uploadLink,
			defaultLink,
		),
	]),
});

export default apolloClient;