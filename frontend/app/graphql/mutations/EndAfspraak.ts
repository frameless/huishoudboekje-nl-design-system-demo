import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";

export const EndAfspraakMutation = gql`
    mutation endAfspraak(
        $id: Int!
        $validThrough: String!
    ){
        updateAfspraak(
            id: $id
            input: {
                validThrough: $validThrough
            }
        ){
            ok
            afspraak{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;