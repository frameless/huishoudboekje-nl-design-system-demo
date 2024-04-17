import {Periodiek} from "../components/shared/PeriodiekSelector";
import {RepeatType} from "../models/models";
import d from "../utils/dayjs";
import zod from "../utils/zod";



const useAlarmValidator = () => {
	return zod.object({
		isPeriodiek: zod.nativeEnum(Periodiek),
		repeatType: zod.nativeEnum(RepeatType).optional(),
		bedrag: zod.number(),
		bedragMargin: zod.number().min(0),
		date: zod.date().optional(),
		startDate: zod.date().refine(date => d(date).isSameOrAfter(d(), "date")).optional(),
		datumMargin: zod.number().min(0).optional(),
		byDay: zod.array(zod.number().min(1).max(7)).min(0).max(7).optional(),
		byMonth: zod.array(zod.number().min(1).max(12)).min(1).max(12).optional(),
		byMonthDay: zod.number().min(1).max(28).optional(),
	}).superRefine((data, ctx) => {
		if (data.isPeriodiek === Periodiek.Eenmalig) {
			const parsed = eenmaligValidator.safeParse(data);
			if (!parsed.success) {
				parsed.error.issues.map(ctx.addIssue);
			}
		}
		if (data.isPeriodiek === Periodiek.Periodiek && data.byMonth != undefined) {
			const parsed = periodiekValidatorMonthly.safeParse(data);
			if (!parsed.success) {
				parsed.error.issues.map(ctx.addIssue);
			}
		}
		if (data.isPeriodiek === Periodiek.Periodiek && data.byMonth === undefined) {
			const parsed = periodiekValidatorWeekly.safeParse(data);
			if (!parsed.success) {
				parsed.error.issues.map(ctx.addIssue);
			}
		}
	});
};

const periodiekValidatorMonthly = zod.object({
	byMonthDay: zod.number().min(1).max(28)
});

const periodiekValidatorWeekly = zod.object({
	byDay: zod.array(zod.number().min(1).max(7)).min(1).max(7),
});

const eenmaligValidator = zod.object({
	date: zod.date(), //.refine(val => d().endOf("day").isSameOrBefore(val)), // Must be in the future
	datumMargin: zod.number().min(0).optional(),
});

export const useEenmaligAlarmValidator = () => eenmaligValidator;

export default useAlarmValidator;
