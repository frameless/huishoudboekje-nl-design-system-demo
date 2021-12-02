import {gql} from "@apollo/client";
import {RubriekFragment} from "../fragments/Rubriek";

export const GetRubriekenConfiguratieQuery = gql`
    query getRubriekenConfiguratie {
        rubrieken {
            id
            naam
            grootboekrekening{
                id
                naam
                omschrijving
            }
        }
        grootboekrekeningen{
            id
            naam
            omschrijving
        }
    }
    ${RubriekFragment}
`;