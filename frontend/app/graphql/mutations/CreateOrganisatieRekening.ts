import {gql} from "@apollo/client";
import {RekeningFragment} from "../fragments/Rekening";

export const CreateAfdelingRekeningMutation = gql`
    mutation createAfdelingRekening(
        $afdelingId: Int!
        $rekening: RekeningInput!
    ){
        createAfdelingRekening(afdelingId: $afdelingId, rekening: $rekening){
            ok
            rekening{
                ...Rekening
            }
        }
    }
    ${RekeningFragment}
`;