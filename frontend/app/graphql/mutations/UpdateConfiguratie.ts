import {gql} from "@apollo/client";

export const UpdateConfiguratieMutation = gql`
    mutation updateConfiguratie($key: String!, $value: String!) {
        updateConfiguratie(input: {
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