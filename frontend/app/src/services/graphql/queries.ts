import {gql} from "@apollo/client";
import {GebruikerFragment} from "./fragments";

export const GetAllGebruikersQuery = gql`
    query getAllGebruikers($showInactive: Boolean = false) {
        gebruikers(showInactive: $showInactive) {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;

export const GetOneGebruikerQuery = gql`
    query getOneGebruikers($id: Int!) {
        gebruiker(id: $id) {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;