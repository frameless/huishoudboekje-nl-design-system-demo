import util from "util";
import {Afdeling, Afspraak, BetaalinstructieInput, Burger, CreateAfspraakInput, Organisatie, Rubriek} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";
import {formatBurgerName} from "../utils/formatBurgerName";
import AddAfspraakBetaalinstructie from "./AddAfspraakBetaalinstructie";
import AddAfspraakZoektermen from "./AddAfspraakZoektermen";

const graphql = getSdkApollo(apolloClient);

type ExtraData = {
	burger: Burger,
	organisatie?: Organisatie,
	afdeling?: Afdeling
	rubriek: Rubriek,
	zoektermen: string[],
	betaalinstructie?: BetaalinstructieInput
};

const CreateAfspraak = async (afspraak: Omit<CreateAfspraakInput, "burgerId" | "organisatieId" | "rubriekId">, extraData: ExtraData): Promise<Afspraak> => {
	const {burger, rubriek, zoektermen = [], betaalinstructie} = extraData;
	const {bedrag, credit, omschrijving, validFrom, validThrough, afdelingId, postadresId} = afspraak;
	let {tegenRekeningId} = afspraak;
	const burgerId = burger.id!;
	const rubriekId = rubriek.id!;

	if (!afdelingId) {
		console.log("Afspraak zonder afdeling gevonden. Gebruik de eerste rekening van de burger als tegenrekening...");
		tegenRekeningId = burger.rekeningen?.[0].id!;
	}
	if (!burgerId) {
		throw new Error("(!) Kan afspraak niet maken: burgerId mist.");
	}
	if (!rubriekId) {
		throw new Error("(!) Kan afspraak niet maken: rubriekId mist.");
	}
	if (!tegenRekeningId) {
		throw new Error("(!) Kan afspraak niet maken: tegenRekeningId mist.");
	}

	const createdAfspraak = await graphql.createAfspraak({
		input: {
			burgerId, afdelingId, postadresId, bedrag, credit, omschrijving, rubriekId, tegenRekeningId, validFrom, validThrough,
		},
	}).then(async result => {
		const resultAfspraak = result.createAfspraak?.afspraak as Afspraak;
		console.log(`Afspraak voor burger ${formatBurgerName(burger)} met ${resultAfspraak.tegenRekening?.iban} op naam van ${resultAfspraak.tegenRekening?.rekeninghouder} toegevoegd.`);

		await AddAfspraakZoektermen(resultAfspraak, zoektermen)
		.catch(err => {
			console.error(`(!) Kon zoektermen ${zoektermen.join(", ")} niet toevoegen voor afspraak ${resultAfspraak.id}:`, util.inspect(err, false, null, true));
		});

		await AddAfspraakBetaalinstructie(resultAfspraak, betaalinstructie)
		.catch(err => {
			console.error(`(!) Kon betaalinstructie niet toevoegen voor afspraak ${resultAfspraak.id}:`, util.inspect(err, false, null, true));
			console.log({afspraak: resultAfspraak, betaalinstructie});
		});

		return resultAfspraak;
	});

	return createdAfspraak;
};

export default CreateAfspraak;