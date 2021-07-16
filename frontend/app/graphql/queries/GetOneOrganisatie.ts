import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";

export const GetOrganisatieQuery = gql`
    query getOrganisatie($id: Int!) {
        organisatie(id: $id){
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;