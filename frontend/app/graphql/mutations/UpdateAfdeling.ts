import {gql} from "@apollo/client";
import {AfdelingFragment} from "../fragments/Afdeling";
import {AfspraakFragment} from "../fragments/Afspraak";

export const UpdateAfdelingMutation = gql`
    mutation updateAfdeling(
        $id: Int!
        $naam: String
		$organisatieId: Int
    ){
        updateAfdeling(
            id: $id
            naam: $naam
			organisatieId: $organisatieId
        ){
            ok
            afdeling {
                ...Afdeling
            }
        }
    }
    ${AfdelingFragment}
`;