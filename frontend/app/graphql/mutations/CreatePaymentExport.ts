import {gql} from "@apollo/client";

export const CreatePaymentExportMutation = gql`
    mutation createPaymentExport($input: CreatePaymentExportRequest! ) {
        PaymentExport_Create(input: $input){
            success
        }
    }
`;