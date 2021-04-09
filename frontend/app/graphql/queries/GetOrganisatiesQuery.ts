import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/OrganisatieFragment";

export const GetOrganisatiesQuery = gql`
    query getOrganisaties {
        organisaties{
            id
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;