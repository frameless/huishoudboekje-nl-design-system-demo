import zod from "../utils/zod";

const useRubriekValidator = () => {
	return zod.object({
		naam: zod.string().min(1),
		grootboekrekening: zod.string().min(1),
	});
};

export default useRubriekValidator;
