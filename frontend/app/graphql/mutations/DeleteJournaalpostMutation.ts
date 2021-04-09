import {gql} from "@apollo/client";

export const DeleteJournaalpostMutation = gql`
    mutation deleteJournaalpost($id: Int!){
        deleteJournaalpost(id: $id){
            ok
        }
    }
`;