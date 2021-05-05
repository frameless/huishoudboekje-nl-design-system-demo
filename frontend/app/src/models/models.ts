// See https://schema.org/DayOfWeek
/* t("schedule.monday") t("schedule.tuesday") t("schedule.wednesday") t("schedule.thursday") t("schedule.friday") t("schedule.saturday") t("schedule.sunday") */
export enum DayOfWeek {
	Monday = 1,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday,
	// PublicHolidays,
}

// See https://schema.org/Schedule
export type Schedule = {
	startDate: Date,
	endDate: Date,
	byDay: DayOfWeek[],
	byMonth: number[],
	byMonthDay: number[],
	byMonthWeek: number,
	exceptDates: Date[],
}