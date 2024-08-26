import {gql} from "@apollo/client";

export const CreatePaymentRecordsMutation = gql`
    mutation PaymentRecordService_CreatePaymentRecords(
        $from: BigInt!
        $to: BigInt!
        $processAt: BigInt
    ){
        PaymentRecordService_CreatePaymentRecords(input: {from: $from, to: $to, processAt: $processAt}){
            count
            data {
                id
                agreement {
                    burger {
                        achternaam
                        voornamen
                        id
                        startDate
                    }
                }
            }
        }
    }
`;