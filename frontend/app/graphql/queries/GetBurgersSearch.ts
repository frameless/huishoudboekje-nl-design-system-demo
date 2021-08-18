import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/Burger";

export const GetBurgersSearchQuery = gql`
    query getBurgersSearch($search: DynamicType) {
        burgers(search: $search) {
            ...Burger
        }
    }
    ${BurgerFragment}
`;