import {objectType} from "@nexus/schema";
import AfsprakenLoader from "../dataloaders/afspraken";
import Afspraak from "./Afspraak";

const Burger = objectType({
	name: "Burger",
	description: "Een burger is een deelnemer.",
	definition: t => {
		t.int("id", {
			description: "Dit is een unique identifier voor een burger in het systeem.",
		});
		t.string("bsn", {
			description: "Het burgerservicenummer.",
		});
		t.string("voorletters");
		t.string("voornamen");
		t.string("achternaam");
		t.string("geboortedatum");
		t.string("telefoonnummer");
		t.string("email");
		t.string("straatnaam");
		t.string("huisnummer");
		t.string("postcode");
		t.string("plaatsnaam");
		t.list.field("afspraken", {
			type: Afspraak,
			resolve: (root, args, ctx) => {
				const {id} = root;
				return AfsprakenLoader.findAllByBurgerId(id);
			},
		});
	},
});

export default Burger;