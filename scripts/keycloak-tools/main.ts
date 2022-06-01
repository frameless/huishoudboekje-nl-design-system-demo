import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import redirectUris from "./src/commands/redirect-uri";

console.log("Huishoudboekje Keycloak Mutation Tool");
console.log();

yargs(hideBin(process.argv))
	.command(redirectUris)
	.demandCommand()
	.help()
	.argv;