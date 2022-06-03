import {objectType} from "nexus";
import {Context} from "../context";

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
			resolve: async (root, _, ctx: Context) => {
				const iban = root["tegen_rekening"];

				if (!iban) {
					return null;
				}

				const rekeningen = await ctx.dataSources.huishoudboekjeservice.getRekeningenByIbans([iban]);
				return rekeningen.shift();
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
			resolve: async (root, _, ctx: Context) => {
				if (!root.id) {
					return null;
				}

				const journaalposten = await ctx.dataSources.huishoudboekjeservice.getJournaalpostenByTransactieIds([root.id]);
				return journaalposten.shift();
			},
		});
	},
});

export const PagedBanktransactie = objectType({
	name: "PagedBanktransactie",
	definition: t => {
		t.list.field("banktransacties", {
			type: "Banktransactie",
		});
		t.field("pageInfo", {
			type: "PageInfo",
		});
	},
});

export default Banktransactie;