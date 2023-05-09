import {gql} from "@apollo/client";

export const GetSaldoRangeQuery = gql`
    query getSaldoClosestTo($burger_ids:[Int!], $date: String!) {
        saldoClosest(burgerIds: $burger_ids, date: $date) {
            burgerId
            begindatum
            einddatum
            saldo
            id
        }
    }
`;