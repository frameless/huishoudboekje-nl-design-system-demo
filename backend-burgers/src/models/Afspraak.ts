import {objectType} from "nexus";

const Afspraak = objectType({
	name: "Afspraak",
	description: "", // Todo
	definition: t => {
		t.int("id", {
			description: "Dit is een unique identifier voor een afspraak in het systeem."
		});
	},
});

export default Afspraak;