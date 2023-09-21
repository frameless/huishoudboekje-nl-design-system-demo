import {gql} from "@apollo/client";

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
`;