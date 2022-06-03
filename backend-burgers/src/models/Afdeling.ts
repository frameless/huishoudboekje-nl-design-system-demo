import {objectType} from "nexus";
import {Context} from "../context";

const Organisatie = objectType({
	name: "Afdeling",
	definition: t => {
		t.int("id");
		t.string("naam");
		t.field("organisatie", {
			type: "Organisatie",
			resolve: async (root, args, ctx: Context) => {
				const organisatieId = root["organisatie_id"];

				return await ctx
					.dataSources.organisatieservice
					.getOrganisatieById(organisatieId);
			},
		});
	},
});

export default Organisatie;