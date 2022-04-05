import {gql} from "@apollo/client";
import BurgerFragment from "./fragments/Burger";

const getBurgerQuery = gql`
    query getBurger($bsn: Int!) {
        burger(bsn: $bsn) {
            ...Burger
        }
    }
    ${BurgerFragment}
`;
