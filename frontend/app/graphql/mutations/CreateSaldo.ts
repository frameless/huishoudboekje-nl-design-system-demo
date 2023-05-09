import {gql} from "@apollo/client";

export const CreateSaldoMutation = gql`
mutation createSaldo($input: CreateSaldoInput) {
    createSaldo(input: $input){
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