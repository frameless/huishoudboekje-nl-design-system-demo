import {gql} from "@apollo/client";
import {RubriekFragment} from "../fragments/Rubriek";

export const GetRubriekenQuery = gql`
    query getRubrieken {
        rubrieken{
            ...Rubriek
            grootboekrekening{
                id
                naam
            }
        }
    }
    ${RubriekFragment}
`;