// See https://schema.org/DayOfWeek
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
	byMonthDay: number,
	byMonthWeek: number,
	exceptDates: Date[],
}