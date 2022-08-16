import zod from "../utils/zod";
import {trimString} from "./utils";

const useZoektermValidator = () => {
	return zod.preprocess(trimString, zod.string().min(1));
};

export default useZoektermValidator;
