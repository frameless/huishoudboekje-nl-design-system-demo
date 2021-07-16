import {gql} from "@apollo/client";

export const DeleteConfiguratieMutation = gql`
    mutation deleteConfiguratie($key: String!) {
        deleteConfiguratie(id: $key){
            ok
        }
    }
`;