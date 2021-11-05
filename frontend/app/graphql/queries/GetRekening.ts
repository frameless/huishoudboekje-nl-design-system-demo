import {gql} from "@apollo/client";

export const GetRekeningQuery = gql`
    query getRekening($id: Int!) {
        rekening(id: $id){
            id
            iban
            rekeninghouder
        }
    }
`;