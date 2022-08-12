import zod from "../utils/zod";

const useDateValidator = () => {
	return zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/));
};

export default useDateValidator;
