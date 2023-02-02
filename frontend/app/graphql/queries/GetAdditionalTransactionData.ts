import {gql} from "@apollo/client";

export const GetAdditionalTransactionData = gql`
    query getAdditionalTransactionData($ibans: [String!], $transaction_ids: [Int!]) {
        rekeningenByIbans(ibans: $ibans){
            iban
            rekeninghouder
        }
        journaalpostenTransactieRubriek(transactionIds: $transaction_ids){
            id
            transactionId
            isAutomatischGeboekt
            afspraakRubriekNaam
            grootboekrekeningRubriekNaam
        }
    }
`;
