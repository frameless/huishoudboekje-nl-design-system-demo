/**
 * This script will dump a bunch of sample data in a Huishoudboekje instance through the GraphQL API.
 * You will find data files in JSON-format in ./data/.
 */
import gql from "graphql-tag";
import {getSdk} from "./graphql";
import apolloClient, {graphQlApiUrl} from "./graphql-client";
import {getSdkApollo} from "./graphql-requester";
import {handleErrors} from "./handleErrors";
import LoadBurgers from "./src/LoadBurgers";
import LoadConfiguraties from "./src/LoadConfiguraties";
import LoadHuishoudens from "./src/LoadHuishoudens";
import LoadOrganisaties from "./src/LoadOrganisaties";
import LoadRubrieken from "./src/LoadRubrieken";
import CreateAfspraak from "./src/operations/CreateAfspraak";

const graphql = getSdkApollo(apolloClient);

const main = async () => {
	console.log(`Controleren of de GraphQL API bereikbaar is op ${graphQlApiUrl}...`);
	await apolloClient.query({query: gql(`{ __schema{ types{ name }}}`)})
	.then(() => {
		console.log(`De GraphQL API is bereikbaar.`);
	})
	.catch(() => {
		console.error(`(!) De GraphQL API is niet bereikbaar.`);
		console.error("Dit betekent dat de API niet online is, of dat het gebruikte token niet geldig is.");
		console.error("Token:", process.env.PROXY_AUTHORIZATION);
		process.exit(0);
	});

	try {
		await LoadConfiguraties();
		await LoadRubrieken();
		await LoadOrganisaties();
		await LoadBurgers();
		await LoadHuishoudens();
	}
	catch (err) {
		console.log(err);
	}
};

main()
.then(() => {
	console.log("Voorbeelddata toegevoegd.");
})
.catch(errs => {
	console.log(errs);

	if (errs) {
		if (errs.length > 1) {
			handleErrors(errs);
		}
		else {
			errs.map(err => handleErrors(err));
		}
	}
	else {
		console.error("Er is een onbekende fout opgetreden.");
	}

	process.exit(1);
});

export {};