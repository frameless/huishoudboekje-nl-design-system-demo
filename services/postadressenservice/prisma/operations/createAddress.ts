import * as zod from "zod";
import prisma from "../../src/client";

const validator = zod.object({
	street: zod.string(),
	houseNumber: zod.string(),
	postalCode: zod.string(),
	locality: zod.string(),
});

const createAddress = async (data: zod.infer<typeof validator>) => {
	try {
		validator.parse(data);
		return await prisma.address.create({data});
	}
	catch (err) {
		throw err;
	}
};

export default createAddress;