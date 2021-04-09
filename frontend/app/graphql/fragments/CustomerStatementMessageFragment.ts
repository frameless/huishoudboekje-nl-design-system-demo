import {gql} from "@apollo/client";
import {TransactieFragment} from "./TransactieFragment";

export const CustomerStatementMessageFragment = gql`
    fragment CustomerStatementMessage on CustomerStatementMessage {
        id
        filename
        uploadDate
        accountIdentification
        closingAvailableFunds
        closingBalance
        forwardAvailableBalance
        openingBalance
        relatedReference
        sequenceNumber
        transactionReferenceNumber
        bankTransactions{
            ...BankTransaction
        }
    }
    ${TransactieFragment}
`;