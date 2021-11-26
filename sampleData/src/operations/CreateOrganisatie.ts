import util from "util";
import {Afdeling, CreateAfdelingInput, CreatePostadresInput, Organisatie} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";
import {handleErrors} from "../../handleErrors";
import {CreateAfdeling} from "./CreateAfdeling";

const graphql = getSdkApollo(apolloClient);

export const CreateOrganisatie = async (organisatie: Required<Organisatie>): Promise<Organisatie> => {
	const {vestigingsnummer, kvknummer, naam, afdelingen} = organisatie;

	const result = await graphql.createOrganisatie({kvknummer, vestigingsnummer, naam}).then(result => {
		console.log(`Organisatie ${result.createOrganisatie?.organisatie?.naam} toegevoegd.`);
		return result;
	});

	const resultOrganisatie = result.createOrganisatie?.organisatie as Organisatie;

	const createAfdelingen = afdelingen.map(afdeling => {
		const {naam, postadressen, rekeningen} = afdeling as Required<Afdeling>;
		const postadressenInput: CreatePostadresInput[] = postadressen.map(p => ({...p} as CreatePostadresInput));
		const afdelingInput: CreateAfdelingInput = {
			naam, postadressen: postadressenInput, rekeningen, organisatieId: resultOrganisatie.id!,
		};

		return CreateAfdeling(resultOrganisatie.id!, afdelingInput)
			.then(result => {
				console.log(`Afdeling ${result.naam} voor organisatie ${resultOrganisatie.naam} aangemaakt.`);
				return result;
			})
			.catch(err => {
				console.error(`(!) Kon afdeling niet aanmaken voor organisatie ${resultOrganisatie.naam}:`, util.inspect(err, false, null, true));
			});
	});

	await Promise.all(createAfdelingen)
				 .catch(err => handleErrors(err))
				 .finally(() => {
					 console.log(`${createAfdelingen.length} ${createAfdelingen.length === 1 ? "afdeling" : "afdelingen"} voor organisatie ${resultOrganisatie.naam} toegevoegd.`);
				 });

	return resultOrganisatie;
};