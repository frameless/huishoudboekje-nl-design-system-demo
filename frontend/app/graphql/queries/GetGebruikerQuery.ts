import {gql} from "@apollo/client";
import {GebruikerFragment} from "../fragments/GebruikerFragment";

export const GetGebruikerQuery = gql`
    query getGebruiker {
        gebruiker {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;