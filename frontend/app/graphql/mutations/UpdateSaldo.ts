import {gql} from "@apollo/client";

export const UpdateSaldoMutation = gql`
mutation updateSaldo($input: UpdateSaldoInput!) {
    updateSaldo(input: $input){
        ok
        saldo {
            id
            burgerId
            einddatum
            begindatum
            saldo
        }
    }
}`