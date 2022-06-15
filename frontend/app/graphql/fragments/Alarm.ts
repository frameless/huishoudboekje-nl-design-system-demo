import {gql} from "@apollo/client";

export const AlarmFragment = gql`
    fragment Alarm on Alarm {
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
`;