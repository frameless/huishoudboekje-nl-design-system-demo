import {gql} from "@apollo/client";

export const DeleteRubriekMutation = gql`
    mutation deleteRubriek($id: Int!){
        deleteRubriek(id: $id){
            ok
        }
    }
`;