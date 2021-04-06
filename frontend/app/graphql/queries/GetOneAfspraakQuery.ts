import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";

export const GetAfspraakQuery = gql`
    query getAfspraak($id: Int!) {
        afspraak(id: $id){
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;