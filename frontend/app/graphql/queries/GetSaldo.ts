import {gql} from "@apollo/client";

export const GetSaldoQuery = gql`
    query getSaldo($burger_ids:[Int!], $date: String!) {
        saldo(burgerIds: $burger_ids, date: $date) {
            id
            burgerId
            begindatum
            einddatum
            saldo
        }
    }
`;