import {gql} from "@apollo/client";

export const UpdateSignaalMutation = gql`
    mutation updateSignaal($id: String!, $input: UpdateSignaalInput!){
        updateSignaal(id: $id, input: $input){
            ok
            signaal {
                ...Signaal
            }
        }
    }
`;