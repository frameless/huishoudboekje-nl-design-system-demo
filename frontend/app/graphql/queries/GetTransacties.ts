import {gql} from "@apollo/client";

export const GetTransactiesQuery = gql`
    query getTransacties($offset: Int!, $limit: Int!, $filters: BankTransactionFilter) {
        bankTransactionsPaged(start: $offset, limit: $limit, filters: $filters){
            banktransactions{
                id
                informationToAccountOwner
                statementLine
                bedrag
                isCredit
                tegenRekeningIban
                transactieDatum
            }
            pageInfo{
                count
                limit
                start
            }
        }
    }
`;

export const GetSearchTransactiesQuery = gql`
    query searchTransacties($offset: Int!, $limit: Int!, $filters: BankTransactionSearchFilter) {
        searchTransacties(offset: $offset, limit: $limit, filters: $filters){
            banktransactions{
                id
                informationToAccountOwner
                statementLine
                bedrag
                isCredit
                isGeboekt
                transactieDatum
                journaalpost{
                    id
                }
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