import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/Burger";

export const GetBurgerQuery = gql`
    query getBurger($id: Int!) {
        burger(id: $id) {
            ...Burger
        }
    }
    ${BurgerFragment}
`;