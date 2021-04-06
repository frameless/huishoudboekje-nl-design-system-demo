import {gql} from "@apollo/client";

export const DeleteAfspraakMutation = gql`
    mutation deleteAfspraak($id: Int!){
        deleteAfspraak(id: $id){
            ok
        }
    }
`;