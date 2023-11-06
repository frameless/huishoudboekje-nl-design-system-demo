import {useTranslation} from "react-i18next";
import {Betaalinstructie, DayOfWeek} from "../generated/graphql";
import {Schedule} from "../models/models";
import d from "./dayjs";
import {humanJoin, Months} from "./things";

const useScheduleHelper = (schedule?: Schedule | Betaalinstructie) => {
	const {t} = useTranslation();
	enum DayNumberOfWeek {
		Sunday = 0,
		Monday = 1,
		Tuesday = 2,
		Wednesday = 3,
		Thursday = 4,
		Friday = 5,
		Saturday = 6
	}

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
		nextScheduled: (): string => {
			let result = "";

			if (!schedule) {
				return result;
			}

			const {byDay, byMonth = [], byMonthDay = [], startDate = "", endDate = ""} = schedule;
			const today = new Date();
			let upcoming = new Date();
			
			today.setHours(0, 0, 0, 0)

			upcoming.setHours(0, 0, 0, 0);
			today.setHours(0, 0, 0, 0);

			if (byDay && byDay.length > 0) {
				const bySortedDays = byDay.map(d => parseInt(DayNumberOfWeek[String(d)])).sort();
				const futureDays = bySortedDays.filter(d => upcoming.getDay() <= d);
				const upcomingDay = futureDays.length ? futureDays[0] : bySortedDays[0];

				upcoming.setDate(upcoming.getDate() + (upcomingDay - upcoming.getDay()));

				result = upcoming.toLocaleDateString(
					"nl-NL",
					{year: "numeric", month: "2-digit", day: "2-digit"}
				);
			}

			if (byMonth !== null && byMonth.length > 0 && byMonthDay.length > 0 && startDate !== endDate) {
				const futureDays = byMonthDay.sort().filter(d => upcoming.getDate() <= d);
				const futureDay = futureDays.length ? futureDays[0] : byMonthDay[0];
				let futureWorkingMonth = upcoming.getMonth();

				if (futureDays.length === 0) {
					futureWorkingMonth = futureWorkingMonth + 1 > 11 ? 0 : futureWorkingMonth + 1;
				}

				const futureMonths = byMonth.map(d => d - 1).filter(d => futureWorkingMonth <= d);
				const futureMonth = futureMonths.length ? futureMonths[0] : byMonth[0] - 1;
				const futureYear = futureMonths.length === 0 ? upcoming.getFullYear() + 1 : upcoming.getFullYear();

				upcoming = new Date(futureYear, futureMonth, futureDay);
				upcoming.setHours(0, 0, 0, 0);

				if (upcoming.getTime() >= d(startDate, "YYYY-MM-DD").toDate().getTime()
					&& upcoming.getTime() >= today.getTime()
					&& (endDate === null || upcoming.getTime() <= d(endDate, "YYYY-MM-DD").toDate().getTime())
				) {
					result = upcoming.toLocaleDateString(
						"nl-NL",
						{year: "numeric", month: "2-digit", day: "2-digit"}
					);
				}
			}

			if (startDate === endDate
				&& d(startDate, "YYYY-MM-DD").toDate().getTime() >= today.getTime()
			) {
				result = d(startDate, "YYYY-MM-DD").format("DD-MM-YYYY"); 
			}

			return result;
		}
	};
};

export default useScheduleHelper;