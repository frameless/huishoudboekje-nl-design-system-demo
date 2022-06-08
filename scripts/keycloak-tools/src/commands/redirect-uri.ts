import ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {CommandModule} from "yargs";
import getClient from "../../client";
import getEnv from "../getenv";

const redirectUris: CommandModule = {
	command: "request-uri <add|remove> [uri] [client-id]",
	describe: "Add or remove a redirect uri to or from a client in Keycloak",
	builder: yargs => yargs
		.positional("add,remove", {
			describe: "Add or remove a redirect uri to or from a client",
			type: "string",
		})
		.positional("uri", {
			describe: "The URI that needs to be added or removed",
			type: "string",
		})
		.positional("client-id", {
			describe: "The Id of the client",
			type: "string",
		})
		.demandOption(["uri", "client-id"])
		.usage(`Usage: $0 request-uri <add|remove> --uri="https://example.com" --client-id="huishoudboekje-medewerkers"`),
	handler: async args => {
		const env = getEnv();
		const {REALM_NAME = ""} = env;

		const {uri = "", clientId = ""} = args;

		const kc = await getClient();

		// Check if the realm exists
		const realm: RealmRepresentation | undefined = await kc.realms.findOne({realm: REALM_NAME ?? ""});
		if (!realm) {
			throw new Error("Realm not found");
		}

		console.log(`Using realm ${realm.realm}.`);

		// Set the realm as default
		kc.setConfig({
			realmName: realm.realm,
		});

		// Check if the client exists
		const clients = await kc.clients.find({
			clientId: clientId as string,
		});

		const client: ClientRepresentation | undefined = clients.pop();

		if (!client || !client.id) {
			console.log(`Client ${clientId} not found`);
			process.exit(1);
		}

		try {
			if (args.add === "add") {
				console.log(`Adding redirect URI ${uri} to client ${clientId}...`);

				await kc.clients.update({
					id: client.id,
				}, {
					redirectUris: [
						...client.redirectUris || [],
						uri as string,
					],
				});
				console.log(`Updated client ${client.clientId}: added redirectUri ${uri}.`);
			}
			else if (args.add === "remove") {
				console.log(`Removing redirect URI ${uri} from client ${clientId}...`);
				await kc.clients.update({
					id: client.id,
				}, {
					redirectUris: (client.redirectUris || []).filter(uri => uri !== args.uri),
				});
				console.log(`Updated client ${client.clientId}: removed redirectUri ${uri}.`);
			}
		}
		catch (err) {
			console.log(err);
			process.exit(1);
		}
	},
};

export default redirectUris;