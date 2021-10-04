import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";

export const CreateOrganisatieMutation = gql`
    mutation createOrganisatie(
        $kvknummer: String!
        $vestigingsnummer: String!
        $naam: String
    ){
        createOrganisatie(
            input: {
                kvknummer: $kvknummer
                vestigingsnummer: $vestigingsnummer
                naam: $naam
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