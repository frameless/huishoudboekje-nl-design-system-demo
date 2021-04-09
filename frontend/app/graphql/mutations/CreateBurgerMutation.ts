import { gql } from "@apollo/client";
import {BurgerFragment} from "../fragments/BurgerFragment";

export const CreateBurgerMutation = gql`
    mutation createBurger($input: CreateBurgerInput) {
        createBurger(input: $input){
            ok
            burger {
                ...Burger
            }
        }
    }
    ${BurgerFragment}
`;