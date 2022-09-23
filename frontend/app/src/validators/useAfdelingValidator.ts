import zod from "../utils/zod";
import {trimString} from "./utils";

const useAfdelingValidator = () => {
	return zod.object({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		naam: zod.preprocess<any>(trimString, zod.string().min(1)),
	});
};

export default useAfdelingValidator;
