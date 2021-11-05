import zod from "../utils/zod";

const AfdelingValidator = zod.object({
	naam: zod.string().nonempty(),
});

export default AfdelingValidator;