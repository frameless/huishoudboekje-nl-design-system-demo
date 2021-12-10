import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

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
		t.list.field("rekeningen", {
			type: "Rekening",
			resolve: (root, args, ctx) => {
				const {id} = root;

				if (!id) {
					return [];
				}

				return DataLoader.getRekeningenByBurgerId(id);
			},
		});
		t.list.field("afspraken", {
			type: "Afspraak",
			resolve: (root, args, ctx) => {
				const {id} = root;

				if (!id) {
					return [];
				}

				return DataLoader.getAfsprakenByBurgerId(id);
			},
		});
		t.list.field("banktransacties", {
			type: "Banktransactie",
			resolve: async (root, args, ctx) => {
				const {id} = root;

				if (!id) {
					return [];
				}

				const transacties = await DataLoader.getBanktransactiesByBurgerId(id);
				return transacties.map(t => ({
					...t,
					informationToAccountOwner: t.information_to_account_owner,
					isCredit: t.is_credit,
					tegenrekeningIban: t.tegen_rekening,
					transactiedatum: t.transactie_datum
				}))
			},
		});
	},
});

export default Burger;