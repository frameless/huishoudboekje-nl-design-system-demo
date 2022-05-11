import {intArg, nonNull, objectType} from "nexus";
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
		t.field("afspraak", {
			type: "Afspraak",
			args: {
				id: nonNull(intArg()),
			},
			resolve: (root, args, ctx) => {
				const {id} = args;

				if (!id) {
					return null;
				}

				return DataLoader.getAfsprakenById(id).then(afspraken => afspraken.shift());
			},
		});
		t.field("banktransactiesPaged", {
			type: "PagedBanktransactie",
			args: {
				limit: nonNull(intArg()),
				start: nonNull(intArg()),
			},
			resolve: async (root, args, ctx) => {
				const {id} = root;
				const {limit, start} = args;

				if (!id) {
					return {
						banktransacties: [],
						pageInfo: null,
					};
				}

				const {banktransacties = [], pageInfo} = await DataLoader.getBanktransactiesByBurgerIdPaged(id, {start, limit});

				return {
					banktransacties: banktransacties.map(t => ({
						...t,
						informationToAccountOwner: t.information_to_account_owner,
						isCredit: t.is_credit,
						tegenrekeningIban: t.tegen_rekening,
						transactiedatum: t.transactie_datum,
					})),
					pageInfo,
				};
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
					transactiedatum: t.transactie_datum,
				}));
			},
		});
	},
});

export default Burger;