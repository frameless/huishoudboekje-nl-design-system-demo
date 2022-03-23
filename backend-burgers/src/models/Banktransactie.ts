import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

const Banktransactie = objectType({
	name: "Banktransactie",
	definition: t => {
		t.int("id");
		t.field("bedrag", {
			type: "Bedrag",
		});
		t.boolean("isCredit", {
			resolve: (root) => root["is_credit"],
		});
		t.string("tegenrekeningIban", {
			resolve: (root) => root["tegen_rekening"],
		});
		t.field("tegenrekening", {
			type: "Rekening",
			resolve: (root) => {
				const iban = root["tegen_rekening"];

				if (!iban) {
					return null;
				}

				return DataLoader.getRekeningenByIbans([iban]).then(r => r.shift());
			},
		});
		t.string("transactiedatum", {
			resolve: (root) => root["transactie_datum"],
		});
		t.string("informationToAccountOwner", {
			resolve: (root) => root["information_to_account_owner"],
		});
		t.field("journaalpost", {
			type: "Journaalpost",
			resolve: async (root) => {
				const id = root.id;

				if (!id) {
					return null;
				}

				return await DataLoader.getJournaalpostByTransactieId(id);
			},
		});
	},
});

export default Banktransactie;