import {ApolloClient, InMemoryCache} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client";

const GraphqlApiUrl = "/api/graphql";
const apolloClient = new ApolloClient({
	uri: GraphqlApiUrl,
	cache: new InMemoryCache(),
	link: createUploadLink({
		uri: GraphqlApiUrl
	}),
});

export default apolloClient;