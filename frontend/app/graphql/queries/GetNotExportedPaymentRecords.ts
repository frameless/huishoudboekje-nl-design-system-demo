import {gql} from "@apollo/client";

export const GetNotExportedPaymentRecordsByIdQuery = gql`
    query getNotExportedPaymentRecordsById($from: BigInt, $to: BigInt) {
        PaymentRecordService_GetNotExportedPaymentRecordDates(input: {from: $from, to: $to}) {
        data {
                date
                id
            }
        }
    }
`;


