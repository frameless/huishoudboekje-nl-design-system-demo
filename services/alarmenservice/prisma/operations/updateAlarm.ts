import {DayOfWeek, Prisma} from "@prisma/client";
import * as zod from "zod";
import prisma from "../../src/client";
import {NotFoundError} from "../../src/errorHandlers";

const validator = zod.object({
	id: zod.string().nonempty(),
	gebruikerEmail: zod.string().optional(),
	afspraakId: zod.number().optional(),
	signaalId: zod.string().optional(),
	isActive: zod.boolean().optional(),
	startDate: zod.string().optional(),
	endDate: zod.string().optional(),
	datumMargin: zod.number().optional(),
	bedrag: zod.number().optional(),
	bedragMargin: zod.number().optional(),
	byDay: zod.nativeEnum(DayOfWeek).array().optional(),
	byMonth: zod.number().array().optional(),
	byMonthDay: zod.number().array().optional(),
});

type UpdateAlarmArgs = zod.infer<typeof validator>;

const updateAlarm = async (data: UpdateAlarmArgs) => {
	try {
		validator.parse(data);

		return await prisma.alarm.update({
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

export default updateAlarm;