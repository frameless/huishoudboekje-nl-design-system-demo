import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

const Journaalpost = objectType({
	name: "Journaalpost",
	definition: t => {
		t.int("id");
		t.field("banktransactie", {
			type: "Banktransactie",
			resolve: async (root) => {
				const transactieId = root["transaction_id"];
				if (!transactieId) {
					return null;
				}

				return await DataLoader.getBanktransactiesById([transactieId]).then(r => r.shift());
			},
		});
		t.field("afspraak", {
			type: "Afspraak",
			resolve: (root) => {
				const afspraakId = root["afspraak_id"];
				if (!afspraakId) {
					return null;
				}

				return DataLoader.getAfsprakenById(afspraakId).then(r => r.shift());
			},
		});
	},
});

export default Journaalpost;