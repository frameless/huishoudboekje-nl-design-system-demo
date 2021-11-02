import {gql} from "@apollo/client";

export const DeleteAfdelingPostadresMutation = gql`
    mutation deleteAfdelingPostadres(
        $id: String!
        $afdelingId: Int!
    ){
        deletePostadres(id: $id, afdelingId: $afdelingId){
            ok
        }
    }
`;