import {gql} from "@apollo/client";

export const DeleteOrganisatieMutation = gql`
    mutation deleteOrganisatie($id: Int!){
        deleteOrganisatie(id: $id){
            ok
        }
    }
`;