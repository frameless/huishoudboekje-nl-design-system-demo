import {gql} from "@apollo/client";

export const GetPaymentExportFileQuery = gql`
    query getPaymentExportFile($input: DownloadPaymentExportRequest!) {
        PaymentExport_GetFile(input: $input){
            id
            name
            fileString
        }
    }
`;