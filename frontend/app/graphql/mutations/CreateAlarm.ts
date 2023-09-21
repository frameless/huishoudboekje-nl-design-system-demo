import {gql} from "@apollo/client";

export const CreateAlarmMutation = gql`
    mutation createAlarm($input: CreateAlarmInput!) {
        createAlarm(input: $input){
            ok
            alarm {
                id
                isActive
                bedrag
                bedragMargin
                startDate
                endDate
                datumMargin
                byDay
                byMonth
                byMonthDay
                afspraak {
                    id
                }
                signaal {
                    id
                }
            }
        }
    }
`;