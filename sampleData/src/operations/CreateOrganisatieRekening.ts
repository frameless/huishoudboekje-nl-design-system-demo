import {Organisatie, Rekening, RekeningInput} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const CreateOrganisatieRekening = async (organisatie: Organisatie, rekening: RekeningInput): Promise<Rekening> => {
	return graphql.createOrganisatieRekening({
		orgId: organisatie.id!,
		rekening: {
			iban: rekening.iban,
			rekeninghouder: rekening.rekeninghouder,
		},
	}).then(result => {
		const resultRekening = result.createOrganisatieRekening?.rekening as Rekening;
		console.log(`Rekening ${resultRekening?.iban} op naam van ${resultRekening?.rekeninghouder} toegevoegd.`);
		return resultRekening;
	});
};

export default CreateOrganisatieRekening;