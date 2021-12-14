import {gql} from "@apollo/client";
import {AfdelingFragment} from "../fragments/Afdeling";

export const GetAfdelingQuery = gql`
    query getAfdeling($id: Int!) {
        afdeling(id: $id){
            ...Afdeling
        }
    }
    ${AfdelingFragment}
`;