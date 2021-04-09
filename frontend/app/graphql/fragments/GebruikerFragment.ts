import {gql} from "@apollo/client";

export const GebruikerFragment = gql`
    fragment Gebruiker on Gebruiker {
        email
    }
`;