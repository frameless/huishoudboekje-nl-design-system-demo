import {gql} from "@apollo/client";

export const CreateConfiguratieMutation = gql`
    mutation createConfiguratie($id: String!, $waarde: String!) {
        createConfiguratie(input: {
            id: $id, waarde: $waarde
        }){
            ok
            configuratie{
                id
                waarde
            }
        }
    }
`;
