import {CreateRubriekMutationVariables, Rubriek} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const CreateRubriek = async (rubriek: CreateRubriekMutationVariables): Promise<Rubriek> => {
	const {naam, grootboekrekening} = rubriek;

	if (!naam || !grootboekrekening) {
		throw new Error(`(!) Kan rubriek ${naam} voor grootboekrekening ${grootboekrekening} niet toevoegen.`);
	}

	return await graphql.createRubriek({naam, grootboekrekening}).then(result => {
		const resultRubriek = result.createRubriek?.rubriek as Rubriek;
		console.log(`Rubriek ${resultRubriek?.naam} voor grootboekrekening ${resultRubriek?.grootboekrekening?.naam} toegevoegd.`);
		return resultRubriek;
	});
};

export default CreateRubriek;