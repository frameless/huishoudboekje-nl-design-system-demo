import util from "util";
import {huishoudens} from "../data";
import {Burger} from "../graphql";
import apolloClient from "../graphql-client";
import {getSdkApollo} from "../graphql-requester";

const graphql = getSdkApollo(apolloClient);

const LoadHuishoudens = async () => {
	console.log("Huishoudens toevoegen...");

	const burgers: Burger[] = await graphql.getBurgers().then(result => result.burgers as Burger[]);
	console.log(`Alle ${burgers.length} burgers opgehaald.`);

	const mHuishoudens = huishoudens.map(huishouden => {
		const burgersInHuishouden: Burger[] = huishouden.burgers.map(bh => burgers.find(b => b.bsn === bh.bsn)).filter(b => b) as Burger[];
		const burgerIds: number[] = burgersInHuishouden.map(b => b.id).filter(b => b) as number[];

		return graphql.createHuishouden({burgerIds})
			.then(result => {
				console.log(`Burgers toegevoegd aan huishouden ${result.createHuishouden?.huishouden?.id}: ${burgersInHuishouden.map(b => `${b.voorletters} ${b.achternaam}`).join(", ")}`);
			})
			.catch(err => {
				console.log("(!) Huishouden kon niet worden aangemaakt.", util.inspect(err, false, null, true));
			});
	});

	return Promise.all(mHuishoudens).finally(() => {
		console.log("Huishoudens toegevoegd.");
		console.log();
	});
};

export default LoadHuishoudens;