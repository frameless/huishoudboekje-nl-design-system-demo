/**
 * This script will dump a bunch of sample data in a Huishoudboekje instance through the GraphQL API.
 * You will find data files in JSON-format in ./data/.
 */
import gql from "graphql-tag";
import {Burger, Organisatie, Rubriek} from "./graphql";
import apolloClient, {graphQlApiUrl} from "./graphql-client";
import {getSdkApollo} from "./graphql-requester";
import {handleErrors} from "./handleErrors";
import LoadBurgers from "./src/LoadBurgers";
import LoadConfiguraties from "./src/LoadConfiguraties";
import LoadHuishoudens from "./src/LoadHuishoudens";
import LoadOrganisaties from "./src/LoadOrganisaties";
import LoadRubrieken from "./src/LoadRubrieken";

const main = async () => {
	console.log(`Controleren of de GraphQL API bereikbaar is op ${graphQlApiUrl}...`);
	await apolloClient.query({query: gql(`{ __schema{ types{ name }}}`)})
		.then(() => {
			console.log(`De GraphQL API is bereikbaar.`);
		})
		.catch((err) => {
			console.error(`(!) De GraphQL API is niet bereikbaar.`);
			console.error("Dit betekent of dat de API niet online is, of dat het gebruikte token niet geldig is.");
			console.error("Token", process.env.PROXY_AUTHORIZATION);
			process.exit(0);
		});

	const graphql = getSdkApollo(apolloClient);

	try {
		await LoadConfiguraties();
		await LoadRubrieken();
		await LoadOrganisaties();

		const rubrieken: Rubriek[] = await graphql.getRubrieken().then(result => result.rubrieken as Rubriek[]);
		console.log(`Alle ${rubrieken.length} rubrieken opgehaald.`);

		const organisaties: Organisatie[] = await graphql.getOrganisaties().then(result => result.organisaties as Organisatie[]);
		console.log(`Alle ${organisaties.length} organisaties opgehaald.`);

		await LoadBurgers(rubrieken, organisaties);

		const burgers: Burger[] = await graphql.getBurgers().then(result => result.burgers as Burger[]);
		console.log(`Alle ${burgers.length} burgers opgehaald.`);

		await LoadHuishoudens(burgers);

	} catch (err) {
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
			console.error("Onbekende fout opgetreden.");
		}

		process.exit(1);
	});

export {};