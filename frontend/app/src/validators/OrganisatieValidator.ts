import {Regex} from "../utils/things";
import zod from "../utils/zod";

const OrganisatieValidator = zod.object({
	kvkNummer: zod.string().regex(Regex.KvkNummer),
	vestigingsnummer: zod.string().regex(Regex.Vestigingsnummer),
	naam: zod.string().nonempty(),
	straatnaam: zod.string().nonempty(),
	huisnummer: zod.string().nonempty(),
	postcode: zod.string().regex(Regex.ZipcodeNL),
	plaatsnaam: zod.string().nonempty(),
});

export default OrganisatieValidator;