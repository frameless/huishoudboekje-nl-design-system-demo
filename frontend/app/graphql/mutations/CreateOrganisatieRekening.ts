import {gql} from "@apollo/client";

export const CreateAfdelingRekeningMutation = gql`
    mutation createAfdelingRekening(
        $afdelingId: Int!
        $rekening: RekeningInput!
    ){
        createAfdelingRekening(afdelingId: $afdelingId, rekening: $rekening){
            ok
            rekening{
                id
                iban
                rekeninghouder
            }
        }
    }
`;