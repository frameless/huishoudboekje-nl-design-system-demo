import {Afspraak} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const AddAfspraakZoektermen = async (afspraak: Afspraak, zoektermen: string[]): Promise<void> => {
	const afspraakId = afspraak.id;

	if (!afspraakId) {
		throw new Error("(!) Kon zoektermen niet toevoegen voor afspraak. Afspraak niet bekend.");
	}

	if (zoektermen.length === 0) {
		console.log(`Geen zoektermen opgegeven voor afspraak ${afspraakId}.`);
		return Promise.resolve();
	}

	const addZoektermen = zoektermen.map(zoekterm => {
		return graphql.addAfspraakZoekterm({afspraakId, zoekterm})
			.then(() => {
				console.log(`Zoekterm ${zoekterm} toegevoegd aan afspraak ${afspraakId}.`);
			});
	});

	await Promise.all(addZoektermen)
		.finally(() => {
			console.log(`Zoektermen ${zoektermen.join(", ")} toegevoegd aan afspraak ${afspraakId}.`);
		});
};

export default AddAfspraakZoektermen;