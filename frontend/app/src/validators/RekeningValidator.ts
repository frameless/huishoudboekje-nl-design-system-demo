import {Regex} from "../utils/things";
import zod from "../utils/zod";

const RekeningValidator = zod.object({
	rekeninghouder: zod.string().nonempty().max(100),
	iban: zod.string().regex(Regex.IbanNL),
});

export default RekeningValidator;