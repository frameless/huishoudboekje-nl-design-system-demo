import util from "util";
import {burgers} from "../data";
import {Afspraak, BetaalinstructieInput, Burger, Organisatie, Rubriek} from "../graphql";
import apolloClient from "../graphql-client";
import {getSdkApollo} from "../graphql-requester";
import {handleErrors} from "../handleErrors";
import CreateAfspraak from "./operations/CreateAfspraak";
import CreateBurger from "./operations/CreateBurger";
import {formatBurgerName} from "./utils/formatBurgerName";

const graphql = getSdkApollo(apolloClient);

const LoadBurgers = async () => {
	console.log("Burgers toevoegen...");

	const rubrieken: Rubriek[] = await graphql.getRubrieken().then(result => result.rubrieken as Rubriek[]);
	console.log(`Alle ${rubrieken.length} rubrieken opgehaald.`);

	const organisaties: Organisatie[] = await graphql.getOrganisaties().then(result => result.organisaties as Organisatie[]);
	console.log(`Alle ${organisaties.length} organisaties opgehaald.`);

	const existingBurgers: Burger[] = await graphql.getBurgers().then(result => result.burgers as Burger[]);
	console.log(`Er bestaan al ${existingBurgers.length} burgers.`);

	const createBurgers = burgers.map(async b => {
		const burgerName = formatBurgerName(b);

		// Create Burger
		const createdBurger = await CreateBurger(b)
			.catch(err => {
				if (err.message.includes("already exists")) {
					console.log(`(!) Burger ${burgerName} bestaat al.`);
					// Try to find the existing burger so that we can create Afspraken.
					return existingBurgers.find(b => b.bsn);
				}
				else {
					console.error(`(!) Kon burger ${burgerName} niet toevoegen:`, util.inspect(err, false, null, true));
				}
			}) as Burger;

		if (!createdBurger) {
			console.error(`(!) Burger ${burgerName} niet toegevoegd.`);
			return Promise.reject();
		}

		// Create Afspraken for burger
		const createAfspraken = b.afspraken.map(async (afspraak, i) => {
			const organisatieData = afspraak["organisatie"]; // Todo: There is no field organisatie on Afspraak, but it is on the data.
			const {bedrag, credit = true, omschrijving = "", validFrom, rubriek, validThrough, zoektermen = []} = afspraak;
			const betaalinstructie = afspraak.betaalinstructie as BetaalinstructieInput;

			// Find Organisatie by kvkNummer
			const organisatie: Organisatie | undefined = organisaties.find(o => o.kvknummer === organisatieData?.kvknummer);
			const afdeling = organisatie?.afdelingen?.[0];
			const afdelingId = afdeling?.id;
			const postadresId: string = afdeling?.postadressen?.[0]?.id!;

			if(afdeling && !postadresId){
				throw new Error("(!) De afdeling voor deze afspraak heeft geen postadres.")
			}

			let tegenRekeningId = afdeling?.rekeningen?.[0]?.id || createdBurger.rekeningen?.[0]?.id;
			if(!tegenRekeningId){
				throw new Error("(!) De afdeling voor deze afspraak heeft geen tegenrekening.")
			}

			// Find Rubriek by naam
			const _rubriek = rubrieken.find(r => r.naam === rubriek?.naam);

			if (!_rubriek) {
				throw new Error(`(!) Kan afspraak ${i} voor ${burgerName} niet maken: rubriek [${rubriek?.naam}] mist.`);
			}

			return CreateAfspraak(
				{bedrag, credit, omschrijving, afdelingId, postadresId, validFrom, validThrough, tegenRekeningId},
				{burger: createdBurger, rubriek: _rubriek, organisatie: organisatie, zoektermen, betaalinstructie},
			).catch(err => {
				console.error(`(!) Kon afspraak voor burger ${burgerName} niet toevoegen:`, util.inspect(err, false, null, true));
			}) as Afspraak;
		});

		for (let a of createAfspraken) {
			await a.then(() => {
				console.log(`${createAfspraken.length} afspra(a)k(en) voor burger ${burgerName} toegevoegd.`);
			}).catch(err => handleErrors(err));
		}

		return createdBurger;
	});

	for (let p of createBurgers) {
		await p.then(createdBurger => {
			console.log(`Alles voor burger ${formatBurgerName(createdBurger)} toegevoegd.`);
		});
	}

	console.log(`${createBurgers.length} burger(s) toegevoegd.`);
	console.log();
};

export default LoadBurgers;