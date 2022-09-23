import {Regex} from "../utils/things";
import zod from "../utils/zod";
import {trimString} from "./utils";

const useRekeningValidator = () => {
	return zod.object({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		rekeninghouder: zod.preprocess<any>(trimString, zod.string().min(1).max(100)),
		iban: zod.string().regex(Regex.IbanNL),
	});
};

export default useRekeningValidator;
