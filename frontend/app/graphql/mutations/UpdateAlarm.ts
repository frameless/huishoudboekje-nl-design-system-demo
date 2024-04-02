import {gql} from "@apollo/client";

export const UpdateAlarmMutation = gql`
    mutation updateAlarm($input: UpdateAlarmRequest!){
        Alarms_Update(input: $input){
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