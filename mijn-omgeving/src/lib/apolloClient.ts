import {ApolloClient, InMemoryCache} from "@apollo/client";
import {BatchHttpLink} from "@apollo/client/link/batch-http";

// Todo: get this from ENV or whatever.
const GraphqlApiUrl = "https://test.huishoudboekje.demoground.nl/api/burgers";

const link = new BatchHttpLink({
	uri: GraphqlApiUrl,
	batchMax: 20,
	batchInterval: 250,
	batchDebounce: true,
});

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link,
});

export default apolloClient;