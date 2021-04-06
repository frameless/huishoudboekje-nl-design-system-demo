import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/BurgerFragment";

export const GetBurgerQuery = gql`
    query getBurger($id: Int!) {
        burger(id: $id) {
            ...Burger
        }
    }
    ${BurgerFragment}
`;