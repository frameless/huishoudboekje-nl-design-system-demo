import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

const Banktransactie = objectType({
	name: "Banktransactie",
	definition: t => {
		t.int("id");
		t.field("bedrag", {
			type: "Bedrag",
		});
		t.boolean("isCredit");
		t.string("tegenrekeningIban");
		t.field("tegenrekening", {
			type: "Rekening",
			resolve: (root) => {
				const iban = root.tegenrekeningIban;

				if (!iban) {
					return null;
				}

				return DataLoader.getRekeningenByIbans([iban]).then(r => r.shift());
			},
		});
		t.string("transactiedatum");
		t.string("informationToAccountOwner");
		t.field("afspraak", {
			type: "Afspraak",
			resolve: async (root) => {
				const afspraakId = root.afspraak_id;
				const afspraak = await DataLoader.getAfspraakById(afspraakId);
				return ({
					...afspraak,
				});
			},
		});
	},
});

export default Banktransactie;