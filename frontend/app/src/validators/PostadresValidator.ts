import {Regex} from "../utils/things";
import zod from "../utils/zod";

const PostadresValidator = zod.object({
	straatnaam: zod.string().nonempty(),
	huisnummer: zod.string().nonempty(),
	postcode: zod.string().regex(Regex.ZipcodeNL),
	plaatsnaam: zod.string().nonempty(),
});

export default PostadresValidator;