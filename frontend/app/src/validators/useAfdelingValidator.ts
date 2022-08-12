import zod from "../utils/zod";
import {trimString} from "./utils";

const useAfdelingValidator = () => {
	return zod.object({
		naam: zod.preprocess(trimString, zod.string().min(1)),
	});
};

export default useAfdelingValidator;
