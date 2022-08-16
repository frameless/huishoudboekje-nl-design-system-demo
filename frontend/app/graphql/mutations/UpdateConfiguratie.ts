import {gql} from "@apollo/client";

export const UpdateConfiguratieMutation = gql`
    mutation updateConfiguratie($id: String!, $waarde: String!) {
        updateConfiguratie(input: {
            id: $id,
            waarde: $waarde
        }){
            ok
            configuratie{
                id
                waarde
            }
        }
    }
`;
