import {ApolloClient, InMemoryCache} from "@apollo/client";
import {BatchHttpLink} from "@apollo/client/link/batch-http";

type HuishoudboekjeApolloClientSettings = {
	apiUrl: string
}

const createApolloClient = ({apiUrl}: HuishoudboekjeApolloClientSettings) => {
	const link = new BatchHttpLink({
		uri: apiUrl,
		batchMax: 20,
		batchInterval: 250,
		batchDebounce: true,
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link,
	});
};

export default createApolloClient;
