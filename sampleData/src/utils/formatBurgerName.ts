import {Burger} from "../../graphql";

export const formatBurgerName = (burger?: Burger): string => {
	if(!burger){
		return "???";
	}

	const {voorletters, achternaam} = burger;

	return [
		voorletters?.replace(/\./g, "").split("").join(". ") + ".",
		achternaam,
	].join(" ");
};