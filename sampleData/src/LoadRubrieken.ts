import util from "util";
import {rubrieken} from "../data";
import CreateRubriek from "./operations/CreateRubriek";

const LoadRubrieken = async () => {
	console.log("Rubrieken toevoegen...");

	const mRubrieken = rubrieken.map(r => {
		return CreateRubriek(r)
			.catch(err => {
				if (err.message.includes("already exists")) {
					console.log(`(!) Rubriek ${r.naam} bestaat al.`);
				}
				else {
					console.error(`(!) Kon rubriek ${r.naam} voor grootboekrekening ${r.grootboekrekening} niet toevoegen:`, util.inspect(err, false, null, true));
				}
			});
	});

	return Promise.all(mRubrieken).finally(() => {
		console.log("Rubrieken toegevoegd.");
		console.log();
	});
};

export default LoadRubrieken;