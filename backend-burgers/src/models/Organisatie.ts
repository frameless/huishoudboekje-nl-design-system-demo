import {objectType} from "nexus";

const Organisatie = objectType({
	name: "Organisatie",
	definition: t => {
		t.int("id");
		t.string("naam");
		t.string("kvknummer");
		t.string("vestigingsnummer");
	},
});

export default Organisatie;