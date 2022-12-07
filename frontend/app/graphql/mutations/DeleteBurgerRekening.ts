import {gql} from "@apollo/client";

export const DeleteBurgerRekeningMutation = gql`
    mutation deleteBurgerRekening(
        $rekeningId: Int!
        $burgerId: Int!
    ){
        deleteBurgerRekening(
            rekeningId: $rekeningId,
            burgerId: $burgerId
        ){
            ok
        }
    }
`;
