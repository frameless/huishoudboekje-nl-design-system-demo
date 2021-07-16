import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";
import {RubriekFragment} from "../fragments/Rubriek";

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