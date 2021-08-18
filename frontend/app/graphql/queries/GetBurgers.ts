import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/Burger";

export const GetBurgersQuery = gql`
    query getBurgers {
        burgers {
            ...Burger
        }
    }
    ${BurgerFragment}
`;