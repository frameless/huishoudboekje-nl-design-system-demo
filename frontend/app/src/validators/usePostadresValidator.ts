import {Regex} from "../utils/things";
import zod from "../utils/zod";

const usePostadresValidator = () => {
	return zod.object({
		straatnaam: zod.string().min(1),
		huisnummer: zod.string().min(1),
		postcode: zod.string().regex(Regex.ZipcodeNL),
		plaatsnaam: zod.string().min(1),
	});
};

export default usePostadresValidator;
