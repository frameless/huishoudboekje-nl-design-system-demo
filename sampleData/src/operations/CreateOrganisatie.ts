import util from "util";
import {Afdeling, CreateAfdelingInput, CreatePostadresInput, Organisatie} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";
import {handleErrors} from "../../handleErrors";
import {CreateAfdeling} from "./CreateAfdeling";

const graphql = getSdkApollo(apolloClient);

export const CreateOrganisatie = (organisatie: Required<Organisatie>): Promise<Organisatie> => {
	const {vestigingsnummer, kvknummer, naam, afdelingen} = organisatie;

	return graphql.createOrganisatie({kvknummer, vestigingsnummer, naam})
		.then(async result => {
			const resultOrganisatie = result.createOrganisatie?.organisatie as Organisatie;
			console.log(`Organisatie ${resultOrganisatie?.naam} (${resultOrganisatie?.id}) toegevoegd.`);

			const createAfdelingen = afdelingen.map(afdeling => {
				const {naam, postadressen, rekeningen} = afdeling as Required<Afdeling>;
				const postadressenInput: CreatePostadresInput[] = postadressen.map(p => ({...p} as CreatePostadresInput));
				const afdelingInput: CreateAfdelingInput = {
					naam, postadressen: postadressenInput, rekeningen, organisatieId: resultOrganisatie.id!,
				};

				return CreateAfdeling(resultOrganisatie.id!, afdelingInput).catch(err => {
					console.error(`(!) Kon afdeling niet aanmaken voor organisatie ${resultOrganisatie.naam}:`, util.inspect(err, false, null, true));
				});
			});

			for(let a of createAfdelingen){
				await a.then(() => {
					console.log(`${createAfdelingen.length} afdelingen voor organisatie ${resultOrganisatie.naam} toegevoegd.`);
				}).catch(err => handleErrors(err));
			}

			return resultOrganisatie;
		});
};