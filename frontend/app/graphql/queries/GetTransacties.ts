import {gql} from "@apollo/client";

export const GetSearchTransactiesQuery = gql`
    query searchTransacties($offset: Int!, $limit: Int!, $filters: BankTransactionSearchFilter) {
        searchTransacties(offset: $offset, limit: $limit, filters: $filters){
            banktransactions{
                id
                uuid
                informationToAccountOwner
                statementLine
                bedrag
                isCredit
                isGeboekt
                transactieDatum
                journaalpost{
                    id
                    rubriek{
                        naam
                    }
                }
                tegenRekeningIban
                tegenRekening{
                    iban
                    rekeninghouder
                }
            }
            pageInfo{
                count
                limit
                start
            }
        }
    }
`;