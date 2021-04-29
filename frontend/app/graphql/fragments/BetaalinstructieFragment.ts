import {gql} from "@apollo/client";

export const BetaalinstructieFragment = gql`
    fragment Betaalinstructie on Betaalinstructie {
        byDay
        byMonth
        byMonthDay
        exceptDates
        repeatFrequency
        startDate
        endDate
    }
`;