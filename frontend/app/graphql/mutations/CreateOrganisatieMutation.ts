import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/OrganisatieFragment";

export const CreateOrganisatieMutation = gql`
    mutation createOrganisatie(
        $huisnummer: String
        $kvkNummer: String!
        $vestigingsnummer: String!
        $naam: String
        $plaatsnaam: String
        $postcode: String
        $straatnaam: String
    ){
        createOrganisatie(
            input: {
                huisnummer: $huisnummer
                kvkNummer: $kvkNummer
                vestigingsnummer: $vestigingsnummer
                naam: $naam
                plaatsnaam: $plaatsnaam
                postcode: $postcode
                straatnaam: $straatnaam
            }
        ){
            ok
            organisatie {
                ...Organisatie
            }
        }
    }
    ${OrganisatieFragment}
`;