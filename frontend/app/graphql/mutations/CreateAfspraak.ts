import { gql } from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";

export const CreateAfspraakMutation = gql`
    mutation createAfspraak(
        $input: CreateAfspraakInput!
    ){
        createAfspraak(
            input: $input
        ){
            ok
            afspraak {
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;