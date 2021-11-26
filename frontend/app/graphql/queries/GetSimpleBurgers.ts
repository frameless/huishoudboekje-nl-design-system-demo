import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/Burger";

export const GetSimpleBurgersQuery = gql`
    query getSimpleBurgers {
        burgers {
            id
            bsn
            voorletters
            achternaam
        }
    }
    ${BurgerFragment}
`;