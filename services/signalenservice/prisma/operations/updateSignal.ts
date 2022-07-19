import {Prisma} from "@prisma/client";
import * as zod from "zod";
import prisma from "../../src/client";
import {NotFoundError} from "../../src/errorHandlers";

const validator = zod.object({
	id: zod.string(),
	actions: zod.string().array().optional(),
	alarmId: zod.string().nonempty().optional(),
	banktransactieIds: zod.number().array().optional(),
	context: zod.any().optional(),
	bedragDifference: zod.string().optional(),
	isActive: zod.boolean().optional(),
	type: zod.string().optional(),
});

const updateSignal = async (data: zod.infer<typeof validator>) => {
	try {
		validator.parse(data);

		return await prisma.signal.update({
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

export default updateSignal;
