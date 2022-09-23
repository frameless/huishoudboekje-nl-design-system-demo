import {useTranslation} from "react-i18next";
import {Betaalinstructie, DayOfWeek} from "../generated/graphql";
import {Schedule} from "../models/models";
import d from "./dayjs";
import {humanJoin, Months} from "./things";

const useScheduleHelper = (schedule?: Schedule | Betaalinstructie) => {
	const {t} = useTranslation();

	return {
		toString: (): string => {
			if (!schedule) {
				return t("schedule.unknown");
			}

			const {byDay, byMonth = [], byMonthDay = [], startDate, endDate} = schedule;

			if (byDay && byDay.length > 0) {
				if (byDay.length === 7) {
					return t("schedule.everyDay");
				}

				return [t("schedule.everyWeek"), t("schedule.onDays", {days: humanJoin(byDay.map(d => t("schedule." + String(DayOfWeek[d]).toLowerCase())))})].join(" ");
			}

			if (byMonth.length > 0 && byMonthDay.length > 0) {
				const str = [];

				if (startDate && endDate) {
					const dStartDate = d(startDate, "YYYY-MM-DD");
					const dEndDate = d(endDate, "YYYY-MM-DD");
					const periodLength = Math.abs(dStartDate.diff(dEndDate, "seconds"));
					const onceDate = d().year(dStartDate.year()).month(byMonth[0] - 1).date(byMonthDay[0]);

					if (!onceDate.isValid()) {
						return t("unknown");
					}

					if (periodLength <= 3600 * 24 * 365) {
						str.push(t("schedule.onceOnDate", {date: onceDate.format("L")}));
					}
				}
				else {
					if (byMonth.length > 0) {
						if (byMonth.length >= 12) {
							str.push(t("schedule.everyMonth"));
						}
						else {
							str.push(t("schedule.everyYear"), t("schedule.inMonths", {months: humanJoin(byMonth.map(b => t("months." + Months[b - 1])))}));
						}
					}

					if (byMonthDay.length > 0) {
						str.push(t("schedule.onDates", {dates: humanJoin(byMonthDay.map(b => b + "e"))}));
					}
				}

				if (str.length === 0) {
					return t("schedule.eenmalig");
				}

				return str.join(" ");
			}

			if(byMonth.length === 0 || byMonthDay.length === 0 || !byDay){
				return t("schedule.eenmalig");
			}

			// Todo: this happens when there is a startDate and endDate, but no byMonth, byMonthDay, or byDay
			return JSON.stringify(schedule, null, 2);
		},
	};
};

export default useScheduleHelper;
