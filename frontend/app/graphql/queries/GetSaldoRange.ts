import {gql} from "@apollo/client";

export const GetSaldoRangeQuery = gql`
    query getSaldoByDateRange($burger_ids:[Int!], $startdate: String!, $enddate: String!) {
        saldoRange(burgerIds: $burger_ids, startdate: $startdate, enddate: $enddate) {
            burgerId
            begindatum
            einddatum
            saldo
        }
    }
`;