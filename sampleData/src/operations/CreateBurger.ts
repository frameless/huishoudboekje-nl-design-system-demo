import {Burger} from "../../graphql";
import apolloClient from "../../graphql-client";
import {getSdkApollo} from "../../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const CreateBurger = async (burger: Burger): Promise<Burger> => {
	const {
		bsn,
		voorletters,
		voornamen,
		achternaam,
		email,
		geboortedatum,
		huisnummer,
		plaatsnaam,
		postcode,
		straatnaam,
		telefoonnummer,
		rekeningen,
	} = burger;

	const burgerName = [voorletters, achternaam].join(" ");

	return await graphql.createBurger({
		input: {bsn, voorletters, voornamen, achternaam, email, geboortedatum, huisnummer, plaatsnaam, postcode, straatnaam, telefoonnummer, rekeningen},
	}).then((result) => {
		const resultBurger = result.createBurger?.burger as Burger;
		console.log(`Burger ${burgerName} toegevoegd.`);
		return resultBurger;
	});
};

export default CreateBurger;