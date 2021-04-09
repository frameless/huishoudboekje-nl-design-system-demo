import {gql} from "@apollo/client";

export const UpdateRekeningMutation = gql`
    mutation updateRekening($id: Int!, $iban: String, $rekeninghouder: String){
        updateRekening(id: $id, rekening: {
            iban: $iban,
            rekeninghouder: $rekeninghouder
        }){
            ok
        }
    }
`;