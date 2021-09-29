import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";

export const CreateOrganisatieMutation = gql`
    mutation createOrganisatie(
        $kvknummer: String!
        $vestigingsnummer: String!
        $naam: String
#        $straatnaam: String
#        $huisnummer: String
#        $postcode: String
#        $plaatsnaam: String
    ){
        createOrganisatie(
            input: {
                kvknummer: $kvknummer
                vestigingsnummer: $vestigingsnummer
                naam: $naam
#                straatnaam: $straatnaam
#                huisnummer: $huisnummer
#                postcode: $postcode
#                plaatsnaam: $plaatsnaam
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