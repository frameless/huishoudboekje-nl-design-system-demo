import util from "util";
import {organisaties} from "../data";
import {CreateOrganisatie} from "./operations/CreateOrganisatie";

const LoadOrganisaties = async () => {
	console.log("Organisaties toevoegen...");

	const mOrganisaties = organisaties.map(o => {
		return CreateOrganisatie(o).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Organisatie ${o.kvkDetails.naam} (${o.kvkDetails.nummer}) bestaat al.`);
			}
			else {
				console.log("(!) Kon organisatie niet toevoegen.", util.inspect(err, false, null, true));
			}
		});
	});

	return Promise.all(mOrganisaties)
		.finally(() => {
			console.log("Organisaties toegevoegd.");
			console.log();
		});
};

export default LoadOrganisaties;