import {gql} from "@apollo/client";

export const GetTransactiesQuery = gql`
    query getTransacties($offset: Int!, $limit: Int!, $filters: BankTransactionFilter) {
        bankTransactionsPaged(start: $offset, limit: $limit, filters: $filters){
            banktransactions{
                ...BankTransaction
            }
            pageInfo{
                count
                limit
                start
            }
        }
    }
`;