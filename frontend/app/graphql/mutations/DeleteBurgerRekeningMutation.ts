import {gql} from "@apollo/client";

export const DeleteBurgerRekeningMutation = gql`
    mutation deleteBurgerRekening(
        $id: Int!
        $burgerId: Int!
    ){
        deleteBurgerRekening(id: $id, burgerId: $burgerId){
            ok
        }
    }
`;