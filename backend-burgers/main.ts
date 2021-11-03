import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";
import dotenv from "dotenv";
import schema from "./src/schema";

dotenv.config();

const PORT = process.env.APP_PORT || 8080;

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
	server.listen({
		port: PORT,
	}).then(({url}) => {
		console.log(`Server running on ${url}.`);
	});
};

main();