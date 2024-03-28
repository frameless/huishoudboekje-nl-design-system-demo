import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client";
import {BatchHttpLink} from "@apollo/client/link/batch-http";
import DebounceLink from "apollo-link-debounce";
import {createUploadLink} from "apollo-upload-client";
import {onError} from "@apollo/client/link/error";
import {AuthRoutes} from "../utils/useAuth";

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


const authErrorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
	if (graphQLErrors) {

		for (const error of graphQLErrors) {
			if (error.extensions.code == "UNAUTHENTICATED") {
				// This might not be fast enough, in which case it needs to somehow be retried after the fetch finishes. 
				// Problem here is that .then() returns a promise, which is not expected by apollo and this wont compile.
				// No fix as of now
				fetch(AuthRoutes.check)
				return forward(operation)
			}
		}
	}
	if (networkError?.message.includes("401")) {
		// Same issue here
		fetch(AuthRoutes.check)
		return forward(operation)
	}

});

const debounceLink = new DebounceLink(500);

const isProduction = process.env.NODE_ENV === "production"

const apolloClient = new ApolloClient({
	cache: new InMemoryCache({addTypename: false}),
	connectToDevTools: !isProduction,
	link: ApolloLink.from([
		debounceLink,
		authErrorLink,
		ApolloLink.split(
			(operation) => operation.getContext().method === "fileUpload",
			uploadLink,
			defaultLink,
		),
	]),
});

export default apolloClient;