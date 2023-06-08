import {gql} from "@apollo/client";

export const GetCreateAfspraakFormDataQuery = gql`
    query getCreateAfspraakFormData($burgerId: Int!) {
        burger(id: $burgerId){
            id
            voorletters
            voornamen
            achternaam
            rekeningen{
                id
                iban
                rekeninghouder
            }
        }
        rubrieken {
            id
            naam
            grootboekrekening{
                id
                naam
                credit
            }
        }
        organisaties {
            id
            naam
            kvknummer
            vestigingsnummer
        }
    }
`;