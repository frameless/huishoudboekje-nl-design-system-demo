import {gql} from "@apollo/client";

export const GetRekeningenByIbansQuery = gql`
    query getRekeningenByIbans($ibans: [String!]) {
        rekeningenByIbans(ibans: $ibans){
            iban
            rekeninghouder
          }
    }
`;
