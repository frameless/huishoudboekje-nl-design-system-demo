import {Prisma} from "@prisma/client";
import * as zod from "zod";
import prisma from "../../src/client";
import {NotFoundError} from "../../src/errorHandlers";

const validator = zod.object({
	id: zod.string(),
	street: zod.string().optional(),
	houseNumber: zod.string().optional(),
	postalCode: zod.string().optional(),
	locality: zod.string().optional(),
});

type UpdateAddressArgs = zod.infer<typeof validator>;

const updateAddress = async (data: UpdateAddressArgs) => {
	try {
		validator.parse(data);

		return await prisma.address.update({
			data,
			where: {
				id: data.id,
			},
		});
	}
	catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				throw new NotFoundError();
			}
		}
		throw err;
	}
};

export default updateAddress;