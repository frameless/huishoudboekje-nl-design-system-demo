import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

const Journaalpost = objectType({
	name: "Journaalpost",
	description: "", // Todo
	definition: t => {
		t.int("id", {
			description: "Een unique identifier voor een journaalpost in het systeem.",
		});
		t.field("banktransactie", {
			type: "Banktransactie",
			resolve: (root) => {
				return null; // Todo getBanktransactiesByJournaalpostId
			},
		});
		t.field("afspraak", {
			type: "Afspraak",
			resolve: (root) => {
				console.log({root});
				const afspraakId = undefined; // Todo

				if (!afspraakId) {
					return null;
				}

				return DataLoader.getAfspraakById(afspraakId);
			},
		});
	},
});

export default Journaalpost;