import {DayOfWeek} from "@prisma/client";
import * as zod from "zod";
import prisma from "../../src/client";

const validator = zod.object({
	gebruikerEmail: zod.string(),
	afspraakId: zod.number(),
	signaalId: zod.string().optional(),
	datum: zod.string(),
	datumMargin: zod.number(),
	bedrag: zod.number(),
	bedragMargin: zod.number(),
	byDay: zod.nativeEnum(DayOfWeek).array(),
	byMonth: zod.number().array(),
	byMonthDay: zod.number().array(),
	isActive: zod.boolean(),
});

const createAlarm = async (data: zod.infer<typeof validator>) => {
	const validatedData = validator.parse(data);

	const {gebruikerEmail, afspraakId, signaalId, datum, datumMargin, bedrag, bedragMargin, byDay, byMonth, byMonthDay, isActive} = validatedData;

	return await prisma.alarm.create({
		data: {
			gebruikerEmail,
			afspraakId,
			signaalId,
			datum,
			datumMargin,
			bedrag,
			bedragMargin,
			byDay,
			byMonth,
			byMonthDay,
			isActive,
		},
	});
};

export default createAlarm;