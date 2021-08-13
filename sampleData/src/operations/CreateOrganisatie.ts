import util from "util";
import {Organisatie, OrganisatieKvK} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";
import CreateOrganisatieRekening from "./CreateOrganisatieRekening";

const graphql = getSdkApollo(apolloClient);

export const CreateOrganisatie = (organisatie: Required<Organisatie>): Promise<Organisatie> => {
	const {vestigingsnummer, kvkDetails, rekeningen} = organisatie;
	const {straatnaam, huisnummer, postcode, plaatsnaam, nummer: kvkNummer, naam} = kvkDetails as Required<OrganisatieKvK>;

	return graphql.createOrganisatie({vestigingsnummer, huisnummer, naam, kvkNummer, plaatsnaam, postcode, straatnaam})
		.then(async result => {
			const resultOrganisatie = result.createOrganisatie?.organisatie as Organisatie;

			console.log(`Organisatie ${resultOrganisatie?.kvkDetails?.naam} (${resultOrganisatie?.id}) toegevoegd.`);

			const mRekeningen = rekeningen.map(rekening => {
				return CreateOrganisatieRekening(resultOrganisatie, rekening).catch(err => {
					console.error(`(!) Kon rekening niet aanmaken voor organisatie ${resultOrganisatie.kvkDetails?.naam}:`, util.inspect(err, false, null, true));
				});
			});

			await Promise.all(mRekeningen).finally(() => {
				console.log(`${mRekeningen.length} rekening(en) toegevoegd voor ${resultOrganisatie.kvkDetails?.naam} (${resultOrganisatie.id}).`);
			});

			return resultOrganisatie;
		});
};