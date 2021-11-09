import {objectType} from "nexus";
import DayOfWeek from "../types/DayOfWeek";

const Betaalinstructie = objectType({
	name: "Betaalinstructie",
	definition: t => {
		t.list.field("byDay", {
			type: DayOfWeek,
		});
		t.list.int("byMonth");
		t.list.string("byMonthDay");
		t.string("repeatFrequency");
		t.list.string("exceptDates");
		t.string("startDate");
		t.string("endDate");
	},
});

export default Betaalinstructie;