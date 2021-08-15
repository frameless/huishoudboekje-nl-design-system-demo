import {Configuratie, ConfiguratieInput} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const CreateConfiguratie = async (configuratie: ConfiguratieInput): Promise<Configuratie> => {
	const {
		id: key,
		waarde: value = "",
	} = configuratie;

	return await graphql.createConfiguratie({key, value})
		.then(result => {
			const resultConfiguratie = result.createConfiguratie?.configuratie as Configuratie;
			console.log(`Configuratie ${key} met waarde ${value} toegevoegd.`);
			return resultConfiguratie;
		});
};

export default CreateConfiguratie;