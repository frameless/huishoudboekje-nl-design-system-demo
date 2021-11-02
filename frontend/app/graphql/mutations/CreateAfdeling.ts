import {gql} from "@apollo/client";
import {AfdelingFragment} from "../fragments/Afdeling";

export const CreateAfdelingMutation = gql`
    mutation createAfdeling(
        $naam: String!
        $organisatieId: Int!
        $postadressen: [CreatePostadresInput]
        $rekeningen: [RekeningInput]
    ){
        createAfdeling(
            input: {
                naam: $naam,
                organisatieId: $organisatieId,
                postadressen: $postadressen,
                rekeningen: $rekeningen,
            }
        ){
            ok
            afdeling {
                ...Afdeling
            }
        }
    }
    ${AfdelingFragment}
`;