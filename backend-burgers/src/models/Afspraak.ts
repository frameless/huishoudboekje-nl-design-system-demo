import {objectType} from "nexus";
import {Context} from "../context";

const Afspraak = objectType({
	name: "Afspraak",
	definition: t => {
		t.int("id", {
			description: "Een unique identifier voor een afspraak in het systeem.",
		});
		t.string("omschrijving");
		t.string("bedrag");
		t.boolean("credit");
		t.field("betaalinstructie", {
			type: "Betaalinstructie",
			resolve: (root: any) => {
				const betaalinstructie = root.betaalinstructie;

				if (!betaalinstructie) {
					return null;
				}

				return {
					byDay: betaalinstructie.by_day,
					byMonth: betaalinstructie.by_month,
					byMonthDay: betaalinstructie.by_month_day,
					repeatFrequency: betaalinstructie.repeat_frequency,
					exceptDates: betaalinstructie.except_dates,
					startDate: betaalinstructie.start_date,
					endDate: betaalinstructie.end_date,
				};
			},
		});
		t.string("validFrom", {
			resolve: root => root["valid_from"],
		});
		t.string("validThrough", {
			resolve: root => root["valid_through"],
		});
		t.field("tegenrekening", {
			type: "Rekening",
			resolve: async (root, _, ctx: Context) => {
				const rekeningId = root["tegen_rekening_id"];

				if (!rekeningId) {
					return null;
				}

				return await ctx
					.dataSources.huishoudboekjeservice
					.getRekeningById(rekeningId);
			},
		});
		t.list.field("journaalposten", {
			type: "Journaalpost",
			resolve: async (root, _, ctx: Context) => {
				const {id} = root;

				if (!id) {
					return [];
				}

				return await ctx
					.dataSources.huishoudboekjeservice
					.getJournaalpostenByAfspraakId(id);
			},
		});
	},
});

export default Afspraak;