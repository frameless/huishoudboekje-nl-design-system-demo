import {gql} from "@apollo/client";

export const DeleteAfdelingRekeningMutation = gql`
    mutation deleteAfdelingRekening(
        $id: Int!
        $afdelingId: Int!
    ){
        deleteAfdelingRekening(afdelingId: $afdelingId, rekeningId: $id){
            ok
        }
    }
`;