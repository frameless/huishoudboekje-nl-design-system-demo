import {gql} from "@apollo/client";

export const CreateBurgerRekeningMutation = gql`
    mutation createBurgerRekening(
        $burgerId: Int!
        $rekening: RekeningInput!
    ){
        createBurgerRekening(burgerId: $burgerId, rekening: $rekening){
            ok
            rekening{
                id
                iban
                rekeninghouder
            }
        }
    }
`;