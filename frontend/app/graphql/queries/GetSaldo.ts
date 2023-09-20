import {gql} from "@apollo/client";

export const GetBurgerRapportageQuery = gql`
    query getSaldo($burgers:[Int!]!, $date:Date!) {
        saldo(burgerIds: $burgers, date: $date) {
            saldo
        }
    }
`;