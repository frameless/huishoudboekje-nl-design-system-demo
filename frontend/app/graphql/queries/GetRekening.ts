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

export const GetRekeningenQuery = gql`
    query getRekeningen {
        rekeningen{
            id
            rekeninghouder
            iban
        }
    }
`;

