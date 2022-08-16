import {Regex} from "../utils/things";
import zod from "../utils/zod";
import {trimString} from "./utils";

const useRekeningValidator = () => {
	return zod.object({
		rekeninghouder: zod.preprocess(trimString, zod.string().min(1).max(100)),
		iban: zod.string().regex(Regex.IbanNL),
	});
};

export default useRekeningValidator;
