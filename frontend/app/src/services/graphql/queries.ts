import {gql} from "@apollo/client";
import {GebruikerFragment, OrganisatieFragment, AfspraakFragment} from "./fragments";

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

export const NewAfspraakQuery = gql`
    query newAfspraak($citizenId: Int!) {
        gebruiker(id: $citizenId) {
            voornamen
            achternaam
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

export const GetAllAfsprakenQuery = gql`
    query getAllAfspraken {
        afspraken{
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;

export const GetOneAfspraakQuery = gql`
    query getOneAfspraak($id: Int!) {
        afspraak(id: $id){
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;