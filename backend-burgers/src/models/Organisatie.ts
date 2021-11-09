import {objectType} from "nexus";

const Organisatie = objectType({
	name: "Organisatie",
	definition: t => {
		t.int("id");
		t.int("naam");
	},
});

export default Organisatie;