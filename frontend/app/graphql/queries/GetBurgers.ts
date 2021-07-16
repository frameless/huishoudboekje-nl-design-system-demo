import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/BurgerFragment";

export const GetBurgersQuery = gql`
    query getBurgers {
        burgers {
            ...Burger
        }
    }
    ${BurgerFragment}
`;