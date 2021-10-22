import {Regex} from "../utils/things";
import zod from "../utils/zod";

const OrganisatieValidator = zod.object({
	kvknummer: zod.string().regex(Regex.KvkNummer),
	vestigingsnummer: zod.string().regex(Regex.Vestigingsnummer),
	naam: zod.string().nonempty().max(100),
});

export default OrganisatieValidator;