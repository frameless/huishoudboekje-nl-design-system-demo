import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

const Organisatie = objectType({
	name: "Afdeling",
	definition: t => {
		t.int("id");
		t.string("naam");
		t.field("organisatie", {
			type: "Organisatie",
			resolve: root => {
				const organisatieId = root["organisatie_id"];
				return DataLoader.getOrganisatiesById([organisatieId]).then(r => r.shift());
			},
		});
	},
});

export default Organisatie;