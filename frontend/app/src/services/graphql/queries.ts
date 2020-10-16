import {gql} from "@apollo/client";
import {GebruikerFragment, OrganisatieFragment} from "./fragments";

export const GetAllGebruikersQuery = gql`
    query getAllGebruikers {
        gebruikers {
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

export const GetAllOrganisatiesQuery = gql`
    query getAllOrganisaties {
        organisaties{
            id
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;

export const GetOneOrganisatieQuery = gql`
    query getOneOrganisatie($id: Int!) {
        organisatie(id: $id){
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;