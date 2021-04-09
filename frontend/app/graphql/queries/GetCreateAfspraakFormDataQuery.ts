import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/OrganisatieFragment";
import {RekeningFragment} from "../fragments/RekeningFragment";
import {RubriekFragment} from "../fragments/RubriekFragment";

export const GetCreateAfspraakFormDataQuery = gql`
    query getCreateAfspraakFormData($burgerId: Int!) {
        burger(id: $burgerId){
            rekeningen{
                ...Rekening
            }
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
    ${RekeningFragment}
    ${RubriekFragment}
    ${OrganisatieFragment}
`;