import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";

export const UpdateOrganisatieMutation = gql`
    mutation updateOrganisatie(
        $id: Int!
        $kvknummer: String
        $vestigingsnummer: String
        $naam: String
    ) {
        updateOrganisatie(
            id: $id
            kvknummer: $kvknummer
            vestigingsnummer: $vestigingsnummer
            naam: $naam
        ){
            ok
            organisatie {
                ...Organisatie
            }
        }
    }
    ${OrganisatieFragment}
`;