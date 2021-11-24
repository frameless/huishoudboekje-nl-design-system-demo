import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";

export const GetOrganisatiesQuery = gql`
    query getOrganisaties {
        organisaties {
            id
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;

export const GetSimpleOrganisatiesQuery = gql`
    query getSimpleOrganisaties {
        organisaties {
            id
            naam
        }
    }
`;