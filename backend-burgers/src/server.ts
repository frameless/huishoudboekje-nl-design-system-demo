import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";
import dotenv from "dotenv";
import Banktransactieservice from "./datasources/banktransactieservice";
import Huishoudboekjeservice from "./datasources/huishoudboekjeservice";
import Organisatieservice from "./datasources/organisatieservice";
import schema from "./schema";
import debugPlugin from "./utils/debugPlugin";
import {isDev} from "./utils/things";

dotenv.config();

const server = new ApolloServer({
	schema,
	cors: {
		credentials: true,
	},
	dataSources: () => ({
		huishoudboekjeservice: new Huishoudboekjeservice(),
		organisatieservice: new Organisatieservice(),
		banktransactieservice: new Banktransactieservice(),
	}),
	debug: isDev,
	plugins: [
		ApolloServerPluginLandingPageGraphQLPlayground(),
		...(process.env.NODE_ENV !== "test") ? [debugPlugin()] : [],
	],
});

export default server;
