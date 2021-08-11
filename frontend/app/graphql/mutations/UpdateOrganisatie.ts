import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";

export const UpdateOrganisatieMutation = gql`
    mutation updateOrganisatie(
        $id: Int!
        $huisnummer: String
        $kvkNummer: String
        $vestigingsnummer: String
        $naam: String
        $plaatsnaam: String
        $postcode: String
        $straatnaam: String
    ) {
        updateOrganisatie(
            id: $id
            huisnummer: $huisnummer
            kvkNummer: $kvkNummer
            vestigingsnummer: $vestigingsnummer
            naam: $naam
            plaatsnaam: $plaatsnaam
            postcode: $postcode
            straatnaam: $straatnaam
        ){
            ok
            organisatie {
                ...Organisatie
            }
        }
    }
    ${OrganisatieFragment}
`;