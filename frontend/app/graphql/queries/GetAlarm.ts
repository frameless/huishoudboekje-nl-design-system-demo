import {gql} from "@apollo/client";

export const GetAlarmQuery = gql`
    query getAlarm($id: String!) {
        alarm(id: $id) {
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
`;