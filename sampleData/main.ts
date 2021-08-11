/**
 * This script will dump a bunch of sample data in a Huishoudboekje instance through the GraphQL API.
 * You will find data files in ./data/*.json.
 */
import gql from "graphql-tag";
import util from "util";
import {burgers, configuraties, organisaties, rubrieken} from "./data";
import {Afspraak, Organisatie, OrganisatieKvK, Rubriek} from "./graphql";
import apolloClient, {graphQlApiUrl} from "./graphql-client";
import {getSdkApollo} from "./graphql-requester";
import {handleErrors} from "./handleErrors";

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
	const {
		createConfiguratie,
		createRubriek,
		createOrganisatie,
		createOrganisatieRekening,
		getOrganisaties,
		getRubrieken,
		createBurger,
		createAfspraak,
		addAfspraakZoekterm,
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
				console.error("(!) Kon configuraties niet toevoegen:", err);
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
				console.error("(!)", err);
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
		const {vestigingsnummer, kvkDetails, rekeningen} = o as Required<Organisatie>;
		const {straatnaam, huisnummer, postcode, plaatsnaam, nummer: kvkNummer, naam} = kvkDetails as Required<OrganisatieKvK>;

		return createOrganisatie({
			vestigingsnummer, huisnummer, naam, kvkNummer, plaatsnaam, postcode, straatnaam,
		}).then(async r => {
			const org = r.createOrganisatie?.organisatie;

			console.log(`Organisatie ${r.createOrganisatie?.organisatie?.kvkDetails?.naam} (${r.createOrganisatie?.organisatie?.id}) toegevoegd.`);

			if (!org?.id) {
				return;
			}

			/* Add rekeningen for organisatie */
			const mRekeningen = rekeningen.map(r => {
				return createOrganisatieRekening({
					orgId: org.id!,
					rekening: r,
				}).then(r => {
					console.log(`Rekening ${r.createOrganisatieRekening?.rekening?.iban} op naam van ${r.createOrganisatieRekening?.rekening?.rekeninghouder} toegevoegd.`);
				}).catch(err => {
					console.error("(!) Kon rekening niet aanmaken voor organisatie:", err);
					console.log("(!)", util.inspect(err, false, null, true));
				});
			});

			return await Promise.all(mRekeningen).finally(() => {
				console.log(`${mRekeningen.length} rekeningen toegevoegd voor ${r.createOrganisatie?.organisatie?.kvkDetails?.naam} (${r.createOrganisatie?.organisatie?.id}).`);
			});
		}).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Organisatie ${naam} (${kvkNummer}) bestaat al.`);
			}
			else {
				console.log("(!)", util.inspect(err, false, null, true));
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
		})
		.catch(err => {
			console.error("(!) Kon niet alle organisaties ophalen:", err);
			return [];
		});

	/* Fetch all rubrieken */
	console.log("Rubrieken ophalen...");
	const getAllRubrieken: Promise<Rubriek[]> = getRubrieken()
		.then(result => {
			console.log(`Alle rubrieken opgehaald. Het zijn er ${result.rubrieken?.length}.`);
			return result.rubrieken || [];
		})
		.catch(err => {
			console.error("(!) Kon niet alle rubrieken ophalen:", err);
			return [];
		});

	const [allOrganisaties, allRubrieken] = await Promise.all([getAllOrganisaties, getAllRubrieken]).finally(() => {
		console.log("Organisaties en rubrieken opgehaald.");
		console.log();
	});

	/* Add burgers */
	console.log("Burgers toevoegen...");
	const mBurgers = burgers.map(async b => {
		const {bsn, achternaam, voorletters, voornamen, email, geboortedatum, huisnummer, plaatsnaam, postcode, straatnaam, telefoonnummer, rekeningen} = b;

		return await createBurger({
			input: {bsn, achternaam, email, geboortedatum, huisnummer, plaatsnaam, postcode, straatnaam, telefoonnummer, voorletters, voornamen, rekeningen},
		}).then(async r => {
			const burger = r.createBurger?.burger;
			const voorletters = burger?.voorletters?.replace(/\./g, "").split("").join(". ") + ".";
			const burgerName = [voorletters, burger?.achternaam].join(" ");

			console.log(`Burger ${burgerName} toegevoegd.`);

			const mAfspraken = b.afspraken.map(a => {
				const {bedrag, credit = true, omschrijving = "", validFrom, organisatie, rubriek, validThrough, zoektermen} = a as Required<Afspraak>;
				// Find Organisatie by kvkNummer
				const _org = allOrganisaties.find(o => o.kvkNummer === organisatie?.kvkNummer);

				// Find Rubriek by naam
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
					}).then(async result => {
						console.log(`Afspraak voor burger ${burgerName} met ${result.createAfspraak?.afspraak?.organisatie?.kvkDetails?.naam} toegevoegd.`);
						const afspraakId = result.createAfspraak?.afspraak?.id;

						if (afspraakId) {
							const addZoektermen = zoektermen.map(z => {
								return addAfspraakZoekterm({afspraakId, zoekterm: z})
									.then(() => {
										console.log(`Zoekterm ${z} toegevoegd aan afspraak ${afspraakId}.`);
									})
									.catch(err => {
										console.error(`(!) Kon zoekterm ${z} niet toevoegen aan afspraak ${afspraakId}.`, err);
									});
							});

							return await Promise.all(addZoektermen).finally(() => {
								console.log(`Alle zoektermen voor afspraak ${afspraakId} toegevoegd.`);
							});
						}
					}).catch(err => {
						console.error(`(!) Kon afspraak voor burger ${burgerName} niet toevoegen:`, err);
					});
				}
			});

			return await Promise.all(mAfspraken).finally(() => {
				console.log(`Alle afspraken voor burger ${burgerName} toegevoegd.`);
				console.log();
			});
		}).catch(err => {
			const burgerName = [voorletters, achternaam].join(" ");
			console.log(`(!) Kon burger ${burgerName} niet toevoegen:`, err);
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