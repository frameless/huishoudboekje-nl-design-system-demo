import {gql} from "@apollo/client";

export const UpdatePaymentRecordProcessingDateMutation = gql`
    mutation updatePaymentRecordProcessingDate(
        $id: String!
        $processAt: BigInt!
    ) {
        PaymentRecordService_UpdateProcessingDates(
            input: {updates: {id: $id, processAt: $processAt}}) {
                success
        }
    }
`;