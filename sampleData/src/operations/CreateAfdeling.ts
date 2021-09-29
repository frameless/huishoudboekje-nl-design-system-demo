import {Afdeling, CreateAfdelingInput} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

export const CreateAfdeling = (organisatieId: number, afdeling: CreateAfdelingInput): Promise<Afdeling> => {
	const {naam, postadressen, rekeningen} = afdeling;

	return graphql.createAfdeling({naam, organisatieId, postadressen, rekeningen})
		.then(async result => {
			const resultAfdeling = result.createAfdeling?.afdeling as Afdeling;
			console.log(`Afdeling ${resultAfdeling.naam} onder organisatie ${resultAfdeling.organisatie?.naam} (${resultAfdeling.organisatie?.id}) aangemaakt, met ${resultAfdeling.rekeningen?.length} rekeningen en ${resultAfdeling.postadressen?.length} postadressen.`);

			return resultAfdeling;
		});
};