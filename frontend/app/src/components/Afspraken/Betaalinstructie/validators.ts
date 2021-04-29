import {DayOfWeek} from "../../../generated/graphql";
import zod from "../../../utils/zod";

export const validatorEenmalig = zod.object({
	// periodiek: zod.literal(false),
	startDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)),
});

export const validatorPeriodiek = zod.object({
	// periodiek: zod.literal(true),
	startDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)),
	endDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)).optional(),
	byDay: zod.enum(Object.values(DayOfWeek).map(s => String(s)) as [string, ...string[]]),
	byMonthDay: zod.number().min(1).max(28),
	// intervalType: zod.enum([IntervalType.Week, IntervalType.Month]),
	// intervalCount: zod.number().min(1),
});

export const validatorPeriodiekWeek = zod.object({
	// periodiek: zod.literal(true),
	startDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)),
	endDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)).optional(),
	byDay: zod.enum(Object.values(DayOfWeek).map(s => String(s)) as [string, ...string[]]),
	// intervalType: zod.literal(IntervalType.Week),
	// intervalCount: zod.number().min(1),
});

export const validatorPeriodiekMonth = zod.object({
	// periodiek: zod.literal(true),
	startDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)),
	endDate: zod.string().regex(new RegExp(/^\d{4}-\d{2}-\d{2}$/)).optional(),
	byMonth: zod.array(zod.number()).min(1),
	byMonthDay: zod.number().min(1).max(31),
	// intervalType: zod.literal(IntervalType.Month),
	// intervalCount: zod.number().min(1),
});