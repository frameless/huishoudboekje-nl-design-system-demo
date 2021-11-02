import {gql} from "@apollo/client";

export const DeleteAfdelingMutation = gql`
    mutation deleteAfdeling(
        $afdelingId: Int!
    ){
        deleteAfdeling(id: $afdelingId){
            ok
        }
    }
`;