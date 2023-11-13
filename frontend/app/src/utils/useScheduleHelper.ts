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
	const getCalculatingDate = function(
		startDate: string|Date,
		endDate: string|Date|null,
		validFrom : string|Date, 
		validThrough: string|Date
	): Date|false {
		const start = typeof startDate === "string"
			? d(startDate, "YYYY-MM-DD").toDate()
			: startDate;
		const aStart = typeof validFrom === 'string'
			? validFrom === '' ? new Date() : d(validFrom, "YYYY-MM-DD").toDate()
			: validFrom;
		const aEnd = typeof validThrough === 'string'
			? validThrough === '' ? null : d(validThrough, "YYYY-MM-DD").toDate()
			: validThrough;
		const today = new Date();
		start.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);
		let upcoming = start.getTime() >= today.getTime() 
			? start
			: today;
		upcoming = upcoming.getTime() >= aStart.getTime() 
			? upcoming
			: aStart;

		if (aEnd !== null && aEnd.getTime() < upcoming.getTime()) {
			return false
		}

		if (endDate !== null) {
			const until = typeof endDate === "string"
				? d(endDate, "YYYY-MM-DD").toDate()
				: endDate;
			until.setHours(0, 0, 0, 0);

			if (until.getTime() < upcoming.getTime() || until.getTime() < today.getTime()) {
				return false;
			}
		}

		return upcoming;
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
		nextScheduled: (validFrom: string|Date, validThrough: string|Date): string => {
			const result = "";

			if (!schedule) {
				return result;
			}

			const {byDay, byMonth = [], byMonthDay = [], startDate = "", endDate = ""} = schedule;
			const calculatingDate = getCalculatingDate(startDate, endDate, validFrom, validThrough);

			if (calculatingDate === false) {
				return result;
			}

			const returnDate = new Date();
			returnDate.setHours(0, 0, 0, 0);

			if (byDay && byDay.length > 0) {
				const bySortedDays = byDay.map(d => parseInt(DayNumberOfWeek[String(d)])).sort();
				const futureDays = bySortedDays.filter(d => calculatingDate.getDay() <= d);
				const upcomingDay = futureDays.length ? futureDays[0] : bySortedDays[0];
				const addDays = upcomingDay >= calculatingDate.getDay() 
					? upcomingDay - calculatingDate.getDay() 
					: (7 - (upcomingDay - calculatingDate.getDate()));
				calculatingDate.setDate(calculatingDate.getDate() + addDays);

				return calculatingDate.toLocaleDateString(
					"nl-NL",
					{year: "numeric", month: "2-digit", day: "2-digit"}
				);
			}

			if (byMonth !== null && byMonth.length > 0 && byMonthDay.length > 0 && startDate !== endDate) {
				const futureDays = byMonthDay.sort().filter(d => calculatingDate.getDate() <= d);
				const futureWorkingMonth = futureDays.length === 0 ? (calculatingDate.getMonth() + 1) % 12 : calculatingDate.getMonth();
				const futureMonths = futureWorkingMonth === 0 ? [] : byMonth.map(d => d - 1).filter(d => futureWorkingMonth <= d);
				const futureYear = futureMonths.length === 0 ? calculatingDate.getFullYear() + 1 : calculatingDate.getFullYear();
				const futureMonth = futureMonths.length ? futureMonths[0] : byMonth[0] - 1;
				const futureDay = futureDays.length ? futureDays[0] : byMonthDay[0];

				returnDate.setFullYear(futureYear);
				returnDate.setMonth(futureMonth)
				returnDate.setDate(futureDay);

				if (returnDate.getTime() >= calculatingDate.getTime()
					&& returnDate.getTime() >= calculatingDate.getTime()
					&& (endDate === null || returnDate.getTime() <= d(endDate, "YYYY-MM-DD").toDate().getTime())
				) {
					return returnDate.toLocaleDateString(
						"nl-NL",
						{year: "numeric", month: "2-digit", day: "2-digit"}
					);
				}
			}

			if (startDate === endDate
				&& d(startDate, "YYYY-MM-DD").toDate().getTime() >= calculatingDate.getTime()
			) {
				return d(startDate, "YYYY-MM-DD").format("DD-MM-YYYY"); 
			}

			return result;
		}
	};
};

export default useScheduleHelper;