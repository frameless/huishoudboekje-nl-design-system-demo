import {gql} from "@apollo/client";

export const GetAlarmenQuery = gql`
    query getAlarmen {
        alarmen {
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