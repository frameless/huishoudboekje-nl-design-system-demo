import util from "util";
import {burgers} from "../data";
import {Afspraak, BetaalinstructieInput, Burger, Organisatie, Rubriek} from "../graphql";
import {handleErrors} from "../handleErrors";
import CreateAfspraak from "./operations/CreateAfspraak";
import CreateBurger from "./operations/CreateBurger";
import {formatBurgerName} from "./utils/formatBurgerName";

const LoadBurgers = async (rubrieken: Rubriek[], organisaties: Organisatie[]) => {
	console.log("Burgers toevoegen...");

	const createBurgers = burgers.map(async b => {
		const burgerName = formatBurgerName(b);

		// Create Burger
		const createdBurger = await CreateBurger(b).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Burger ${burgerName} bestaat al.`);
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
			const {bedrag, credit = true, omschrijving = "", validFrom, organisatie, rubriek, validThrough, zoektermen = []} = afspraak;
			const betaalinstructie = afspraak.betaalinstructie as BetaalinstructieInput;

			// Find Organisatie by kvkNummer
			const _organisatie = organisaties.find(o => o.kvkNummer === organisatie?.kvkNummer);

			// Find Rubriek by naam
			const _rubriek = rubrieken.find(r => r.naam === rubriek?.naam);

			if (!_rubriek) {
				throw new Error(`(!) Kan afspraak ${i} voor ${burgerName} niet maken: rubriek [${rubriek?.naam}] mist.`);
			}

			return CreateAfspraak({bedrag, credit, omschrijving, validFrom, validThrough}, {
				burger: createdBurger, rubriek: _rubriek, organisatie: _organisatie, zoektermen, betaalinstructie,
			}).catch(err => {
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