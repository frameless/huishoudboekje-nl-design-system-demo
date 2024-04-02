import { useTranslation } from "react-i18next";
import { AlarmData} from "../generated/graphql";
import { Months, WeekDays, humanJoin } from "./things";

export function getAlarmScheduleString(alarm: AlarmData | undefined){
    const {t} = useTranslation();
    let result = t("schedule.unknown")
    if(alarm){
        switch(alarm.AlarmType) { 
            case 1: { 
                if(alarm.recurringMonths?.length == 12){
                    result = [t("schedule.everyMonth"), t("schedule.onDates", {dates: humanJoin(alarm.recurringDayOfMonth?.map(b => b + "e"))})].join(" ");
                }else {
                    result = [t("schedule.repeatType_month"), 
                        t("schedule.inMonths", { months: humanJoin(alarm.recurringMonths?.map(b => t("months." + Months[b - 1])))}),
                        t("schedule.onDates", {dates: humanJoin(alarm.recurringDayOfMonth?.map(b => b + "e"))})].join(" ");
                }
                break;
            } 
            case 2: { 
                if (alarm.recurringDay?.length === 7) {
                    result = t("schedule.everyDay");
                }
                else {
                    result =  [t("schedule.everyWeek"), t("schedule.onDays", {days: humanJoin(alarm.recurringDay?.map(d => t("schedule." + WeekDays[d])))})].join(" ");
                }
                break;
            } 
            case 3: { 
                result = t("schedule.once");
                break;
            } 
            case 4: { 
                result = [t("schedule.everyYear"), 
                    t("schedule.inMonths", { months: humanJoin(alarm.recurringMonths?.map(b => t("months." + Months[b - 1])))}),
                    t("schedule.onDates", {dates: humanJoin(alarm.recurringDayOfMonth?.map(b => b + "e"))})].join(" ");
                    break;
            }
        }
        return result;
    }
}