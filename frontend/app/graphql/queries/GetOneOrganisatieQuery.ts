import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/OrganisatieFragment";

export const GetOrganisatieQuery = gql`
    query getOrganisatie($id: Int!) {
        organisatie(id: $id){
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;