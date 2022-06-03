import {objectType} from "nexus";
import {Context} from "../context";

const Journaalpost = objectType({
	name: "Journaalpost",
	definition: t => {
		t.int("id");
		t.field("banktransactie", {
			type: "Banktransactie",
			resolve: async (root, _, ctx: Context) => {
				const transactieId = root["transaction_id"];

				if (!transactieId) {
					return null;
				}

				return await ctx.dataSources.banktransactieservice.getBanktransactieById(transactieId);
			},
		});
		t.field("afspraak", {
			type: "Afspraak",
			resolve: async (root, _, ctx: Context) => {
				const afspraakId = root["afspraak_id"];
				if (!afspraakId) {
					return null;
				}

				return await ctx.dataSources.huishoudboekjeservice.getAfspraakById(afspraakId);
			},
		});
	},
});

export default Journaalpost;