import {useTranslation} from "react-i18next";
import {Betaalinstructie, DayOfWeek} from "../generated/graphql";
import {Schedule} from "../models/models";
import d from "./dayjs";
import {humanJoin, Months} from "./things";

const useScheduleHelper = (schedule?: Schedule | Betaalinstructie) => {
	const {t} = useTranslation();
	enum DayNumberOfWeek {
		Monday = 1,
		Tuesday = 2,
		Wednesday = 3,
		Thursday = 4,
		Friday = 5,
		Saturday = 6,
		Sunday = 7
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
			let result = t("schedule.n/a");

			if (!schedule) {
				return result;
			}

			const {byDay, byMonth = [], byMonthDay = [], startDate, endDate} = schedule;
			let upcoming = new Date();

			if (byDay && byDay.length > 0) {
				const futureDays = byDay.filter(d => (upcoming.getDay() + 1) < parseInt(DayNumberOfWeek[String(d)]));
				const upcomingDay = futureDays.length ? futureDays[0] : byDay[0];
				upcoming.setDate(upcoming.getDate() + (((parseInt(DayNumberOfWeek[String(upcomingDay)]) + 7 - upcoming.getDay()) % 7) || 7));

				result = d(upcoming.toLocaleDateString(), "DD/MM/YYYY").format("DD-MM-YYYY");
			}

			if (byMonth !== null && byMonth.length > 0 && byMonthDay.length > 0 && startDate !== endDate) {
				const futureDays = byMonthDay.filter(d => upcoming.getDay() < d);
				const futureDay = futureDays.length ? futureDays[0] : byMonthDay[0];

				if (futureDays.length == 0) upcoming.setMonth(upcoming.getMonth() + 1 > 11 ? 0 : upcoming.getMonth() + 1);

				const futureMonths = byMonth.filter(d => upcoming.getMonth() < d);
				const futureMonth = futureMonths.length ? futureMonths[0] : byMonth[0];

				if (futureMonths.length == 0) upcoming.setFullYear(upcoming.getFullYear() + 1);

				const futureYear = upcoming.getFullYear();
				upcoming = new Date(futureYear, futureMonth - 1, futureDay);

				if (upcoming.getTime() >= new Date().getTime()
					&& upcoming.getTime() >= d(startDate, 'YYYY-MM-DD').toDate().getTime() 
					&& upcoming.getTime() <= d(endDate, 'YYYY-MM-DD').toDate().getTime()
				) {
					result = d(upcoming.toLocaleDateString(), "DD/MM/YYYY").format("DD-MM-YYYY");
				}
			}

			if (startDate === endDate) {
				result = d(startDate, "YYYY-MM-DD").format("DD-MM-YYYY")
			}

			return result;
		}
	};
};

export default useScheduleHelper;