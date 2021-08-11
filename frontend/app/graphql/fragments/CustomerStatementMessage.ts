import {gql} from "@apollo/client";
import {TransactieFragment} from "./Transactie";

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
    }
    ${TransactieFragment}
`;