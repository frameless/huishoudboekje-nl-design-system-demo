import {gql} from "@apollo/client";

export const GetPaymentExportsPagedQuery = gql`
    query getPaymentExportsPaged($input: PaymentExportsPagedRequest!) {
        PaymentExport_GetPaged(input: $input){
            data {
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
            }
			PageInfo{
				total_count
				skip
				take
			}
        }
    }
`;