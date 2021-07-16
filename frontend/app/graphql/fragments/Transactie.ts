import {gql} from "@apollo/client";

export const TransactieFragment = gql`
    fragment BankTransaction on BankTransaction {
        id
        informationToAccountOwner
        statementLine
        bedrag
        isCredit
        tegenRekeningIban
        tegenRekening {
            iban
            rekeninghouder
        }
        transactieDatum
    }
`;