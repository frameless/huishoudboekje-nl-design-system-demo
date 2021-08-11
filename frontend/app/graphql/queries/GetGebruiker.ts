import {gql} from "@apollo/client";
import {GebruikerFragment} from "../fragments/Gebruiker";

export const GetGebruikerQuery = gql`
    query getGebruiker {
        gebruiker {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;