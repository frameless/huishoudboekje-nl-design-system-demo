import {objectType} from "nexus";
import {Context} from "../context";

const Rekening = objectType({
	name: "Rekening",
	description: "", // Todo
	definition: t => {
		t.int("id", {
			description: "Een unique identifier voor een rekening in het systeem.",
		});
		t.string("iban", {
			description: "Dit is een IBAN.",
		});
		t.string("rekeninghouder", {
			description: "De naam van de houder van de rekening.",
		});
		t.list.field("afdelingen", {
			type: "Afdeling",
			description: "De afdelingen waar deze rekening bij hoort.",
			resolve: (root, _, ctx: Context) => {
				const afdelingIds = root["afdelingen"] || [];

				if (!afdelingIds || afdelingIds.length === 0) {
					return [];
				}

				return ctx.dataSources.organisatieservice.getAfdelingenById(afdelingIds);
			},
		});
	},
});

export default Rekening;