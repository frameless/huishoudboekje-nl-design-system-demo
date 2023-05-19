import {gql} from "@apollo/client";
import {OrganisatieFragment} from "../fragments/Organisatie";
import {RekeningFragment} from "../fragments/Rekening";
import {RubriekFragment} from "../fragments/Rubriek";

export const GetCreateAfspraakFormDataQuery = gql`
    query getCreateAfspraakFormData($burgerId: Int!) {
        burger(id: $burgerId){
            id
            voorletters
            voornamen
            achternaam
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