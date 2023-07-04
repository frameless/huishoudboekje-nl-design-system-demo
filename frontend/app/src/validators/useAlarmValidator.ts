import {Periodiek} from "../components/shared/PeriodiekSelector";
import {DayOfWeek} from "../generated/graphql";
import {RepeatType} from "../models/models";
import zod from "../utils/zod";

const useAlarmValidator = () => {
	return zod.object({
		isPeriodiek: zod.nativeEnum(Periodiek),
		repeatType: zod.nativeEnum(RepeatType).optional(),
		bedrag: zod.number().min(0),
		bedragMargin: zod.number().min(0),
		date: zod.date().optional(),
		datumMargin: zod.number().min(0).optional(),
		byDay: zod.array(zod.nativeEnum(DayOfWeek)).min(1).optional(),
		byMonth: zod.array(zod.number().min(1).max(12)).min(1).max(12).optional(),
		byMonthDay: zod.number().min(1).max(31).optional(),
	}).superRefine((data, ctx) => {
		if (data.isPeriodiek === Periodiek.Eenmalig) {
			const parsed = eenmaligValidator.safeParse(data);
			if (!parsed.success) {
				parsed.error.issues.map(ctx.addIssue);
			}
		}
		if (data.isPeriodiek === Periodiek.Periodiek) {
			const parsed = periodiekValidator.safeParse(data);
			if (!parsed.success) {
				parsed.error.issues.map(ctx.addIssue);
			}
		}
	});
};

const periodiekValidator = zod.object({
	byMonthDay: zod.number().min(1).max(28).optional(),
});

const eenmaligValidator = zod.object({
	date: zod.date(), //.refine(val => d().endOf("day").isSameOrBefore(val)), // Must be in the future
	datumMargin: zod.number().min(0),
	byMonthDay: zod.number().min(1).max(31),
	byMonth: zod.array(zod.number().min(1).max(12)).min(1).max(12),
});

export const useEenmaligAlarmValidator = () => eenmaligValidator;

export default useAlarmValidator;
