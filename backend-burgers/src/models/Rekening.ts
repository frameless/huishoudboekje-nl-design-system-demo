import {objectType} from "nexus";

const Rekening = objectType({
	name: "Rekening",
	description: "", // Todo
	definition: t => {
		t.int("id", {
			description: "Een unique identifier voor een rekening in het systeem."
		});
		t.string("iban", {
			description: "Dit is een IBAN."
		});
		t.string("rekeninghouder", {
			description: "De naam van de houder van de rekening."
		});
	},
});

export default Rekening;