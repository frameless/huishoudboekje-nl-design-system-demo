import {gql} from "@apollo/client";

//Should use fragment ...BankTransaction again when getting tegenRekening using getRekeningenByIbans is implemented on all locations
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