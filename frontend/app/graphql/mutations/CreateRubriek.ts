import {gql} from "@apollo/client";

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
                    id
                    naam
                    credit
                    omschrijving
                    referentie
                    rubriek{
                        id
                        naam
                    }
                }
            }
        }
    }
`;