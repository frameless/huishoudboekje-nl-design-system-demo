import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";
import {OrganisatieFragment} from "../fragments/Organisatie";
import {RubriekFragment} from "../fragments/Rubriek";

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