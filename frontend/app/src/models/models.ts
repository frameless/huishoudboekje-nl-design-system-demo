export enum AfspraakType {
	Expense = "expense",
	Income = "income"
}

export enum AfspraakPeriod {
	Periodic = "periodic",
	Once = "once"
}

export enum IntervalType {
	Day = "day",
	Week = "week",
	Month = "month",
	Year = "year"
}

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

// export const allDaysOfWeek = Object.values(DayOfWeek).map(d => parseInt(String(d))).filter(d => !isNaN(d));

// See https://schema.org/Schedule
export type Schedule = {
	startDate: Date,
	endDate: Date,
	byDay: DayOfWeek[],
	byMonth: number[],
	byMonthDay: number,
	byMonthWeek: number,
}