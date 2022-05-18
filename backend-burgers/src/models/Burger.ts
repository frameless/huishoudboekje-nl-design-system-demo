import {intArg, nonNull, objectType} from "nexus";
import {Context} from "../context";

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
			resolve: async (root, _, ctx: Context) => {
				if (!root.id) {
					return [];
				}

				return await ctx.dataSources.huishoudboekjeservice.getRekeningenByBurgerId(root.id);
			},
		});
		t.list.field("afspraken", {
			type: "Afspraak",
			resolve: async (root, _, ctx: Context) => {
				const {id} = root;

				if (!id) {
					return [];
				}

				return await ctx.dataSources.huishoudboekjeservice.getAfsprakenByBurgerIds([id]);
			},
		});
		t.field("afspraak", {
			type: "Afspraak",
			args: {
				id: nonNull(intArg()),
			},
			resolve: async (root, args, ctx: Context) => {
				if (!args.id) {
					return null;
				}

				return await ctx.dataSources.huishoudboekjeservice.getAfspraakById(args.id);
			},
		});
		t.field("banktransactiesPaged", {
			type: "PagedBanktransactie",
			args: {
				limit: nonNull(intArg()),
				start: nonNull(intArg()),
			},
			resolve: async (root, args, ctx: Context) => {
				if (!root.id) {
					return [];
				}

				const afspraken = await ctx.dataSources.huishoudboekjeservice.getAfsprakenByBurgerIds([root.id]);
				const afspraakIds = afspraken.reduce((list, a) => [...list, a.id], []);

				const journaalposten = await ctx.dataSources.huishoudboekjeservice.getJournaalpostenByAfspraakId(afspraakIds);
				const banktransactieIds = journaalposten.reduce((list, j) => [...list, j.transaction_id], []);

				const result = await ctx.dataSources.banktransactieservice.getBanktransactiesByIdsPaged(banktransactieIds, args.start, args.limit);
				const banktransacties = result.data.map(t => ({
					...t,
					informationToAccountOwner: t.information_to_account_owner,
					isCredit: t.is_credit,
					tegenrekeningIban: t.tegen_rekening,
					transactiedatum: t.transactie_datum,
				}));

				return {
					banktransacties,
					pageInfo: {
						count: result.count,
						limit: result.limit,
						start: result.start,
					},
				};
			},
		});
		t.list.field("banktransacties", {
			type: "Banktransactie",
			resolve: async (root, _, ctx: Context) => {
				if (!root.id) {
					return [];
				}

				const afspraken = await ctx.dataSources.huishoudboekjeservice.getAfsprakenByBurgerIds([root.id]);
				const afspraakIds = afspraken.reduce((list, a) => [...list, a.id], []);

				const journaalposten = await ctx.dataSources.huishoudboekjeservice.getJournaalpostenByAfspraakId(afspraakIds);
				const banktransactieIds = journaalposten.reduce((list, j) => [...list, j.transaction_id], []);

				const transacties = await ctx.dataSources.banktransactieservice.getBanktransactiesByIds(banktransactieIds);
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