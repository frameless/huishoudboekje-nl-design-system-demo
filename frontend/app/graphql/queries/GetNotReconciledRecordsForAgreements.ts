import {gql} from "@apollo/client";

export const GetNotReconciledRecordsForAgreementsQuery = gql`
    query getNotReconciledRecordsForAgreements($input: GetPaymentRecordsByAgreementsMessage!) {
        PaymentRecordService_GetRecordsNotReconciledForAgreements(input: $input) {
        data {
            id
            originalProcessingDate
            processAt
            paymentExportUuid
            createdAt
            amount
            agreementUuid
            accountName
            accountIban
            }
        }
    }
`;


