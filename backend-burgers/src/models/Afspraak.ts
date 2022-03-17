import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

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
			resolve: (root: any, args, ctx) => {
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
		t.string("validFrom");
		t.string("validThrough");
		// t.field("afdeling", {
		// 	type: "Afdeling",
		//
		// });
		t.field("tegenrekening", {
			type: "Rekening",
			resolve: (root: any) => {
				console.log(root);
				const {tegen_rekening_id} = root;

				if (!tegen_rekening_id) {
					return null;
				}

				return DataLoader
					.getRekeningenByIds([tegen_rekening_id])
					.then(r => r.shift());
			},
		});
		t.list.field("journaalposten", {
			type: "Journaalpost",
			resolve: async (root, args, ctx) => {
				const {id} = root;

				if (!id) {
					return [];
				}

				return await DataLoader.getJournaalpostenByAfspraakId(id);
			},
		});
	},
});

export default Afspraak;