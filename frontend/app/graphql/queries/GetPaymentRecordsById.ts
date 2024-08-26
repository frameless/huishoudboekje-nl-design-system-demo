import {gql} from "@apollo/client";

export const GetPaymentRecordsByIdQuery = gql`
	    query getPaymentRecordsById($input: PaymentRecordsById!) {
        PaymentRecordService_GetPaymentRecordsById(input: $input) {
            data {
                id
                agreement {
                    omschrijving
                    tegenRekening {
                        rekeninghouder
                    }
                }
                amount
                processAt
            }
        }
    }
`;


