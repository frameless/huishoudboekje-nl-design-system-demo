import {gql} from "@apollo/client";

export const UpdateRubriekMutation = gql`
    mutation updateRubriek($id: Int!, $naam: String!, $grootboekrekeningId: String!){
        updateRubriek(id: $id, naam: $naam, grootboekrekeningId: $grootboekrekeningId){
            ok
        }
    }
`;