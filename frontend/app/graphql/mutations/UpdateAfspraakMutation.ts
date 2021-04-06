import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";

export const UpdateAfspraakMutation = gql`
    mutation updateAfspraak(
        $id: Int!
        $input: UpdateAfspraakInput!
    ){
        updateAfspraak(
            id: $id
            input: $input
        ){
            ok
            afspraak{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;