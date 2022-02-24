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

export enum RepeatType {
	Once = "Once",
	Week = "Week",
	Month = "Month",
	Year = "Year"
}

export type DateRange = {
	from?: Date,
	through?: Date,
}

export type BanktransactieFilters = {
	onlyUnbooked?: boolean,
	isCredit: "income" | "expenses" | "all",
	dateRange?: DateRange,
	bedragRange?: [number, number],
	tegenrekeningIban?: string,
}

export enum UploadState {
	QUEUED,
	LOADING,
	DONE
}

export type FileUpload = {
	file: File,
	state: UploadState,
	error?: Error,
}