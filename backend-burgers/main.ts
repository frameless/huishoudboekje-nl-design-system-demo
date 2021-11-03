import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";
import schema from "./src/schema";
import dotenv from "dotenv";

dotenv.config();

const server = new ApolloServer({
	schema,
	debug: true,
	cors: {
		credentials: true,
	},
	plugins: [
		ApolloServerPluginLandingPageGraphQLPlayground(),
	],
	context: ctx => ({
		...ctx,
		services: {},
	}),
});

const main = () => {
	server.listen().then(({url}) => {
		console.log(`Server running on ${url}.`);
	});
};

main();