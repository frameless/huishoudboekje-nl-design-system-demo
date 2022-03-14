// See https://schema.org/Schedule
// import {DayOfWeek} from "../../../frontend/app/src/models/models";

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

export type Schedule = {
    startDate: Date,
    endDate: Date,
    byDay: DayOfWeek[],
    byMonth: number[],
    byMonthDay: number[],
    byMonthWeek: number,
    exceptDates: Date[],
}