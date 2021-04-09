import {gql} from "@apollo/client";

export const UpdateJournaalpostGrootboekrekeningMutation = gql`
    mutation updateJournaalpostGrootboekrekening($id: Int!, $grootboekrekeningId: String!){
        updateJournaalpostGrootboekrekening(input: {
            id: $id
            grootboekrekeningId: $grootboekrekeningId,
        }){
            ok
        }
    }
`;