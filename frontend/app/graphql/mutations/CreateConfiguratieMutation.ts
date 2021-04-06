import {gql} from "@apollo/client";

export const CreateConfiguratieMutation = gql`
    mutation createConfiguratie($key: String!, $value: String!) {
        createConfiguratie(input: {
            id: $key, waarde: $value
        }){
            ok
            configuratie{
                id
                waarde
            }
        }
    }
`;