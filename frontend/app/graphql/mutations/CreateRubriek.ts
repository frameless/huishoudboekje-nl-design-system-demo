import {gql} from "@apollo/client";
import {GrootboekrekeningFragment} from "../fragments/Grootboekrekening";

export const CreateRubriekMutation = gql`
    mutation createRubriek(
        $naam: String, $grootboekrekening: String
    ){
        createRubriek(
            naam: $naam, grootboekrekeningId: $grootboekrekening
        ){
            ok
            rubriek {
                id
                naam
                grootboekrekening{
                    ...Grootboekrekening
                }
            }
        }
    }
    ${GrootboekrekeningFragment}
`;