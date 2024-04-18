import {gql} from "@apollo/client";

export const GetAlarmQuery = gql`
    query getAlarm($input: AlarmId) {
        Alarms_GetById(input: $input) {
            id
            isActive
            amount
            amountMargin
            startDate
            endDate
            dateMargin
            recurringDay
            recurringMonths
            recurringDayOfMonth
            AlarmType
        }
    }
`;