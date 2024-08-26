import {gql} from "@apollo/client";

export const GetPaymentExportQuery = gql`
    query getPaymentExport($input: GetPaymentExportRequest!) {
        PaymentExport_Get(input: $input){
            id
            createdAt
            startDate
            endDate
            file {
                id
                sha256
            }
            recordsInfo {
                count
                processingDates
                totalAmount
            }
            records {
                id
                agreement {
                    omschrijving
                    tegenRekening {
                        rekeninghouder
                    }
                    burger {
                        achternaam
                        voornamen
                        id
                        startDate
                    }
                }
                amount
                processAt
            }
        }
    }
`;