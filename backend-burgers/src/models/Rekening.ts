import {objectType} from "nexus";
import DataLoader from "../dataloaders/dataloader";

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
			description: "De afdeling waar deze rekening bij hoort.",
			resolve: root => {
				const afdelingIds = root["afdelingen"] || [];

				if(!afdelingIds || afdelingIds.length === 0) {
					return [];
				}

				return DataLoader.getAfdelingenById(afdelingIds);
			},
		});
	},
});

export default Rekening;