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
			// Todo: this happens when there is a startDate and endDate, but no byMonth, byMonthDay, or byDay
			let result = JSON.stringify(schedule, null, 2);

			const {byDay, byMonth = [], byMonthDay = [], startDate, endDate} = schedule;
			let periodLongerThenOrYear = true;
			if (endDate !== undefined && endDate !== null) {
				const dateStart = d(startDate, "YYYY-MM-DD").toDate();
				const dateEnd = d(endDate, "YYYY-MM-DD").toDate();
				dateStart.setFullYear(dateStart.getFullYear() + 1)
				dateStart.setHours(0, 0, 0, 0)
				dateEnd.setHours(0, 0, 0, 0)
				periodLongerThenOrYear = dateStart.getTime() <= dateEnd.getTime()
			}
			if (byDay && byDay.length > 0) {
				if (byDay.length === 7) {
					result = t("schedule.everyDay");
				}
				else {
					result = [t("schedule.everyWeek"), t("schedule.onDays", {days: humanJoin(byDay.map(d => t("schedule." + String(DayOfWeek[d]).toLowerCase())))})].join(" ");
				}
			}
			if (byMonth !== null) {
				if (byMonth.length > 0 && byMonthDay.length > 0 && startDate !== endDate) {
					const scheduleStrings = [];
					if (byMonth.length > 0) {
						if (byMonth.length >= 12 && periodLongerThenOrYear) {
							scheduleStrings.push(t("schedule.everyMonth"), t("schedule.onDates", {
								dates: humanJoin(byMonthDay.map(b => b + "e"))
							})
							);
						}
						else {
							if (periodLongerThenOrYear) {
								scheduleStrings.push(t("schedule.everyYear"));
							}
							scheduleStrings.push(t("schedule.inMonths", {
								months: humanJoin(byMonth.map(b => t("months." + Months[b - 1])))
							}), t("schedule.onDates", {
								dates: humanJoin(byMonthDay.map(b => b + "e"))
							}));
						}
					}
					result = scheduleStrings.join(" ");
				}

				if (byMonth.length === 0 && byMonthDay.length === 0 && !byDay) {
					result = t("schedule.eenmalig");
				}
			}
			if (startDate === endDate) {
				result = t("schedule.onceOnDate", {date: d(startDate, "YYYY-MM-DD").format("DD-MM-YYYY")})
			}
			return result;
		},
	};
};

export default useScheduleHelper;
