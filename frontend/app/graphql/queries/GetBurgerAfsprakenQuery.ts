import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";

export const GetBurgerAfsprakenQuery = gql`
    query getBurgerAfspraken($id: Int!) {
        burger(id: $id) {
            afspraken{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;