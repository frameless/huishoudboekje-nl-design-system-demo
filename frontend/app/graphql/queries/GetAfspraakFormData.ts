import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";
import {OrganisatieFragment} from "../fragments/OrganisatieFragment";
import {RubriekFragment} from "../fragments/RubriekFragment";

export const GetAfspraakFormDataQuery = gql`
    query getAfspraakFormData($afspraakId: Int!) {
        afspraak(id: $afspraakId){
            ...Afspraak
        }
        rubrieken {
            ...Rubriek
            grootboekrekening{
                id
                naam
                credit
            }
        }
        organisaties {
            ...Organisatie
        }
    }
    ${AfspraakFragment}
    ${RubriekFragment}
    ${OrganisatieFragment}
`;