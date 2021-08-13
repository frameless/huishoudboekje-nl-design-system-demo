import util from "util";
import {configuraties} from "../data";
import CreateConfiguratie from "./operations/CreateConfiguratie";

const LoadConfiguraties = async () => {
	console.log("Configuraties toevoegen...");

	const mConfiguraties = configuraties.map(c => {
		return CreateConfiguratie(c).catch(err => {
			if (err.message.includes("already exists")) {
				console.log(`(!) Configuratie ${c.id} bestaat al.`);
			}
			else {
				console.error("(!) Kon configuraties niet toevoegen:", util.inspect(err, false, null, true));
			}
		});
	});

	return Promise.all(mConfiguraties)
		.finally(() => {
			console.log("Configuraties toegevoegd.");
			console.log();
		});
};

export default LoadConfiguraties;