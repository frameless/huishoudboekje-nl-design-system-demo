import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client";

const GraphqlApiUrl = "/api/graphql";
const GraphqlApiUrlUpload = "/api/graphql/upload";

const defaultLink = createHttpLink({
	uri: GraphqlApiUrl
});
const uploadLink = createUploadLink({
	uri: GraphqlApiUrlUpload
});

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLink.split(
		(operation) => operation.getContext().method === "fileUpload",
		uploadLink,
		defaultLink
	)
});

export default apolloClient;