import {GebruikersActiviteit} from "../../generated/graphql";

export const gebeurtenis2readable = (g: GebruikersActiviteit): string => {
	console.log(g.action, g.entities);

	return "X heeft Y Z";
}