import {gql} from "@apollo/client";
import {GrootboekrekeningFragment} from "./GrootboekrekeningFragment";

export const RubriekFragment = gql`
    fragment Rubriek on Rubriek {
        id
        naam
        grootboekrekening {
            ...Grootboekrekening
        }
    }
    ${GrootboekrekeningFragment}
`;