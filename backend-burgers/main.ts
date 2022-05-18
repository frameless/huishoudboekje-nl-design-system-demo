import server from "./src/server";
import {config} from "dotenv";
config();

const PORT = process.env.APP_PORT || 8080;

const main = () => {
	server.listen({
		port: PORT,
	}).then(({url}) => {
		console.log(`Server running on ${url}.`);
	});
};

main();