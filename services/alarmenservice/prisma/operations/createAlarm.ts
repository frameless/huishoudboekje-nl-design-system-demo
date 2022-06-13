import {DayOfWeek} from "@prisma/client";
import * as zod from "zod";
import prisma from "../../src/client";

const validator = zod.object({
	afspraakId: zod.number(),
	signaalId: zod.string().optional(),
	startDate: zod.string(),
	endDate: zod.string().optional(),
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

	const {afspraakId, signaalId, startDate, endDate, datumMargin, bedrag, bedragMargin, byDay, byMonth, byMonthDay, isActive} = validatedData;

	return await prisma.alarm.create({
		data: {
			afspraakId,
			signaalId,
			startDate,
			endDate,
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