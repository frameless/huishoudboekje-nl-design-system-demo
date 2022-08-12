import zod from "../utils/zod";
import {trimString} from "./utils";

const useConfiguratieValidator = () => {
	return zod.object({
		id: zod.preprocess(trimString, zod.string().min(1)),
		waarde: zod.preprocess(trimString, zod.string().min(1)),
	});
};

export default useConfiguratieValidator;
