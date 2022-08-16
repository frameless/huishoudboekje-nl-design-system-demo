import {Regex} from "../utils/things";
import zod from "../utils/zod";

const useOrganisatieValidator = () => {
	return zod.object({
		kvknummer: zod.string().regex(Regex.KvkNummer),
		vestigingsnummer: zod.string().regex(Regex.Vestigingsnummer),
		naam: zod.string().min(1).max(100),
	});
};

export default useOrganisatieValidator;

