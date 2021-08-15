import util from "util";
import {Afspraak, BetaalinstructieInput, Burger, CreateAfspraakInput, Organisatie, Rubriek} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";
import {formatBurgerName} from "../utils/formatBurgerName";
import AddAfspraakBetaalinstructie from "./AddAfspraakBetaalinstructie";
import AddAfspraakZoektermen from "./AddAfspraakZoektermen";

const graphql = getSdkApollo(apolloClient);

type ExtraData = {
	burger: Burger,
	organisatie?: Organisatie,
	rubriek: Rubriek,
	zoektermen: string[],
	betaalinstructie?: BetaalinstructieInput
};

const CreateAfspraak = async (afspraak: Omit<CreateAfspraakInput, "burgerId" | "organisatieId" | "rubriekId" | "tegenRekeningId">, extraData: ExtraData): Promise<Afspraak> => {
	const {burger, organisatie, rubriek, zoektermen = [], betaalinstructie} = extraData;
	const {bedrag, credit, omschrijving, validFrom, validThrough} = afspraak;
	const burgerId = burger.id!;
	const organisatieId = organisatie?.id;
	const rubriekId = rubriek.id!;

	// Todo: we now always assume the first Rekening of an Organisatie or Burger.
	const tegenRekeningId = organisatie?.rekeningen?.[0]?.id || burger.rekeningen?.[0].id;

	if (!burgerId) {
		throw new Error("(!) Kan afspraak niet maken: burgerId mist.");
	}
	if (!rubriekId) {
		throw new Error("(!) Kan afspraak niet maken: rubriekId mist.");
	}
	if (!tegenRekeningId) {
		throw new Error("(!) Kan afspraak niet maken: tegenRekeningId mist.");
	}
	if (!organisatieId) {
		console.log("Afspraak zonder organisatie. Gebruik de eerste rekening van de burger als tegenrekening...");
	}

	const createdAfspraak = await graphql.createAfspraak({
		input: {bedrag, credit, omschrijving, validFrom, validThrough, burgerId, organisatieId, rubriekId, tegenRekeningId},
	}).then(result => {
		const resultAfspraak = result.createAfspraak?.afspraak as Afspraak;
		console.log(`Afspraak voor burger ${formatBurgerName(burger)} met ${resultAfspraak.tegenRekening?.iban} op naam van ${resultAfspraak.tegenRekening?.rekeninghouder} toegevoegd.`);
		return resultAfspraak;
	});

	await AddAfspraakZoektermen(createdAfspraak, zoektermen)
		.catch(err => {
			console.error(`(!) Kon zoektermen ${zoektermen.join(", ")} niet toevoegen voor afspraak ${createdAfspraak.id}:`, util.inspect(err, false, null, true));
		});

	await AddAfspraakBetaalinstructie(createdAfspraak, betaalinstructie)
		.catch(err => {
			console.error(`(!) Kon betaalinstructie niet toevoegen voor afspraak ${createdAfspraak.id}:`, util.inspect(err, false, null, true));
		});

	return createdAfspraak;
};

export default CreateAfspraak;