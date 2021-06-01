import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";
import {RubriekFragment} from "../fragments/RubriekFragment";

export const GetTransactieItemFormDataQuery = gql`
    query getTransactionItemFormData {
        rubrieken {
            ...Rubriek
            grootboekrekening{
                id
                naam
            }
        }
        afspraken {
            ...Afspraak
        }
    }
    ${RubriekFragment}
    ${AfspraakFragment}
`;