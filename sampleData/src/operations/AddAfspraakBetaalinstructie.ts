import {Afspraak, BetaalinstructieInput} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const AddAfspraakBetaalinstructie = async (afspraak: Afspraak, betaalinstructie?: BetaalinstructieInput): Promise<void> => {
	const afspraakId = afspraak.id;

	if (!afspraakId) {
		throw new Error("(!) Kon betaalinstructie niet toevoegen voor afspraak. Afspraak niet bekend.");
	}

	if (!betaalinstructie) {
		// console.log(`Geen betaalinstructie opgegeven voor afspraak ${afspraakId}. Negeren...`);
		return Promise.resolve();
	}

	if(afspraak.credit){
		console.log("Betaalinstructie opgegeven voor afspraak met inkomsten. Negeren...");
		return Promise.resolve();
	}

	return graphql.updateAfspraakBetaalinstructie({id: afspraakId, betaalinstructie})
		.then(() => {
			return;
		})
		.finally(() => {
			console.log(`Betaalinstructie toegevoegd aan afspraak ${afspraakId}.`);
		});
};

export default AddAfspraakBetaalinstructie;