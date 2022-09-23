import zod from "../utils/zod";

const useConfiguratieValidator = () => {
	return zod.object({
		id: zod.string().min(1),
		waarde: zod.string().min(1),
	});
};

export default useConfiguratieValidator;
