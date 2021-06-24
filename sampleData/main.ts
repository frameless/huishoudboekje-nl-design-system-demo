/**
 * This script will dump a bunch of sample data in a Huishoudboekje instance through the GraphQL API.
 * You will find data files in ./data/*.json.
 */
import gql from "graphql-tag";
import {burgers, configuraties, organisaties, rubrieken} from "./data";
import {Afspraak, Organisatie, OrganisatieKvK, Rubriek} from "./graphql";
import apolloClient, {graphQlApiUrl} from "./graphql-client";
import {getSdkApollo} from "./graphql-requester";
import {handleErrors} from "./handleErrors";

const main = async () => {
	console.log(`Controleren of de GraphQL API bereikbaar is op ${graphQlApiUrl}...`);
	await apolloClient.query({query: gql(`{ __schema{ types{ name }}}`)})
		.then(() => {
			console.log(`De GraphQL API is bereikbaar op ${graphQlApiUrl}.`);
		})
		.catch((err) => {
			console.error(`(!) De GraphQL API is niet bereikbaar op ${graphQlApiUrl}.`);
			process.exit(0);
		});

	console.log();

	const graphql = getSdkApollo(apolloClient);
	const {
		createConfiguratie,
		createRubriek,
		createOrganisatie,
		createOrganisatieRekening,
		getOrganisaties,
		getRubrieken,
		createBurger,
		createAfspraak,
	} = graphql;

	/* Add configuraties */
	console.log("Configuraties toevoegen...");
	const qConfiguraties = configuraties.map(c => {
		return createConfiguratie({
			key: c.id,
			value: c.waarde,
		}).then(result => {
			console.log(`Configuratie ${result.createConfiguratie?.configuratie?.id} met waarde ${result.createConfiguratie?.configuratie?.waarde} toegevoegd.`);
		}).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Configuratie ${c.id} bestaat al.`);
			}
			else {
				console.error(err);
			}
		});
	});

	/* Add rubrieken */
	console.log("Rubrieken toevoegen...");
	const qRubrieken = rubrieken.map(r => {
		return createRubriek({
			naam: r.naam,
			grootboekrekening: r.grootboekrekening,
		}).then(result => {
			console.log(`Rubriek ${result.createRubriek?.rubriek?.naam} voor grootboekrekening ${result.createRubriek?.rubriek?.grootboekrekening?.naam} toegevoegd.`);
		}).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Rubriek ${r.naam} (${r.grootboekrekening}) bestaat al.`);
			}
			else {
				console.error(err);
			}
		});
	});

	await Promise.all([qConfiguraties, qRubrieken]).finally(() => {
		console.log("Configuraties en rubrieken toegevoegd.");
		console.log();
	});

	/* Add organisaties and its rekeningen */
	console.log("Organisaties toevoegen...");
	const mOrganisaties = organisaties.map(async o => {
		const {weergaveNaam, kvkDetails, rekeningen} = o as Required<Organisatie>;
		const {straatnaam, huisnummer, postcode, plaatsnaam, nummer: kvkNummer, naam} = kvkDetails as Required<OrganisatieKvK>;

		return createOrganisatie({
			weergaveNaam, huisnummer, naam, kvkNummer, plaatsnaam, postcode, straatnaam,
		}).then(async r => {
			const org = r.createOrganisatie?.organisatie;

			console.log(`Organisatie ${r.createOrganisatie?.organisatie?.weergaveNaam} (${r.createOrganisatie?.organisatie?.id}) toegevoegd.`);

			if (!org?.id) {
				return;
			}

			/* Add rekeningen for organisatie */
			const mRekeningen = rekeningen.map(r => {
				return createOrganisatieRekening({
					orgId: org.id!,
					rekening: r,
				}).then(r => {
					console.log(`Rekening ${r.createOrganisatieRekening?.rekening?.iban} op naam van ${r.createOrganisatieRekening?.rekening?.rekeninghouder}.`);
				});
			});

			return await Promise.all(mRekeningen).finally(() => {
				console.log(`Rekeningen voor ${r.createOrganisatie?.organisatie?.weergaveNaam} (${r.createOrganisatie?.organisatie?.id}) toegevoegd.`);
			});
		}).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Organisatie ${weergaveNaam} (${kvkNummer}) bestaat al.`);
			}
			else {
				console.error(err);
			}
		});
	});

	await Promise.all(mOrganisaties).finally(() => {
		console.log("Organisaties toegevoegd.");
		console.log();
	});

	/* Fetch all organisaties */
	console.log("Organisaties ophalen...");
	const getAllOrganisaties: Promise<Organisatie[]> = getOrganisaties()
		.then(result => {
			console.log(`Alle organisaties opgehaald. Het zijn er ${result.organisaties?.length}.`);
			return result.organisaties || [];
		});

	/* Fetch all rubrieken */
	console.log("Rubrieken ophalen...");
	const getAllRubrieken: Promise<Rubriek[]> = getRubrieken()
		.then(result => {
			console.log(`Alle rubrieken opgehaald. Het zijn er ${result.rubrieken?.length}.`);
			return result.rubrieken || [];
		});

	const [allOrganisaties, allRubrieken] = await Promise.all([getAllOrganisaties, getAllRubrieken]).finally(() => {
		console.log("Organisaties en rubrieken opgehaald.");
		console.log();
	});

	/* Add burgers */
	console.log("Burgers toevoegen...");
	const mBurgers = burgers.map(async b => {
		const {achternaam, voorletters, voornamen, email, geboortedatum, huisnummer, plaatsnaam, postcode, straatnaam, telefoonnummer, rekeningen} = b;

		return await createBurger({
			input: {achternaam, email, geboortedatum, huisnummer, plaatsnaam, postcode, straatnaam, telefoonnummer, voorletters, voornamen, rekeningen},
		}).then(async r => {
			const burger = r.createBurger?.burger;
			const voorletters = burger?.voorletters?.replace(/\./g, "").split("").join(". ") + ".";
			const burgerName = [voorletters, burger?.achternaam].join(" ");

			console.log(`Burger ${burgerName} toegevoegd.`);

			const mAfspraken = b.afspraken.map(a => {
				const {bedrag, credit = true, omschrijving = "", validFrom, organisatie, rubriek, validThrough, zoektermen} = a as Required<Afspraak>;
				const _org = allOrganisaties.find(o => o.kvkNummer === organisatie?.kvkNummer);
				const _rubriek = allRubrieken.find(r => r.naam === rubriek?.naam);

				// Todo: add ability to choose a rekening. Now we just assume the first rekening if it exists.
				const _orgFirstRekening = _org?.rekeningen?.[0] || {};

				if (!burger?.id) {
					return;
				}

				if (_org?.id && _orgFirstRekening?.id && _rubriek?.id) {
					return createAfspraak({
						input: {
							bedrag, credit, omschrijving, validFrom,
							burgerId: burger.id,
							organisatieId: _org.id,
							rubriekId: _rubriek.id,
							tegenRekeningId: _orgFirstRekening.id,
						},
					}).then(result => {
						console.log(`Afspraak voor burger ${burgerName} met ${result.createAfspraak?.afspraak?.organisatie?.weergaveNaam} toegevoegd.`);
					});
				}
			});

			return await Promise.all(mAfspraken).finally(() => {
				console.log(`Alle afspraken voor burger ${burgerName} toegevoegd.`);
				console.log();
			});
		});
	});

	await Promise.all(mBurgers).finally(() => {
		console.log("Burgers toegevoegd.");
		console.log();
	});
};

main()
	.then(() => {
		console.log("Voorbeelddata toegevoegd.");
	})
	.catch(errs => {
		handleErrors(errs);
		process.exit(1);
	});

export {};