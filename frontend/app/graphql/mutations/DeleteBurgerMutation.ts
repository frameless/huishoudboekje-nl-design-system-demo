import {gql} from "@apollo/client";

export const DeleteBurgerMutation = gql`
    mutation deleteBurger($id: Int!){
        deleteBurger(id: $id) {
            ok
        }
    }
`;