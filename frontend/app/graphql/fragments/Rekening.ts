import {gql} from "@apollo/client";

export const RekeningFragment = gql`
    fragment Rekening on Rekening {
        id
        iban
        rekeninghouder
    }
`;