import util from "util";
import {organisaties} from "../data";
import {CreateOrganisatie} from "./operations/CreateOrganisatie";

const LoadOrganisaties = async () => {
	console.log("Organisaties toevoegen...");

	organisaties.map(async o => {
		return await CreateOrganisatie(o)
			.then(result => {
				console.log(`Organisatie ${result.naam} toegevoegd.`);
			})
			.catch(err => {
				if (err.message.includes("not unique")) {
					console.log(`(!) Organisatie ${o.naam} (${o.kvknummer}) bestaat al.`);
				}
				else {
					console.log("(!) Kon organisatie niet toevoegen.", util.inspect(err, false, null, true));
				}
			});
	});

	console.log("Organisaties toegevoegd.");
	console.log();
};

export default LoadOrganisaties;