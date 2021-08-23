import {gql} from "@apollo/client";
import {RekeningFragment} from "../fragments/Rekening";

export const CreateBurgerRekeningMutation = gql`
    mutation createBurgerRekening(
        $burgerId: Int!
        $rekening: RekeningInput!
    ){
        createBurgerRekening(burgerId: $burgerId, rekening: $rekening){
            ok
            rekening{
                ...Rekening
            }
        }
    }
    ${RekeningFragment}
`;