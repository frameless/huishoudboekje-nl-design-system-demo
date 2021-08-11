import {gql} from "@apollo/client";
import {BurgerFragment} from "./Burger";

export const HuishoudenFragment = gql`
    fragment Huishouden on Huishouden {
        id
        burgers {
            ...Burger
        }
    }
    ${BurgerFragment}
`;