import {gql} from "@apollo/client";

export const AddHuishoudenBurgerMutation = gql`
    mutation addHuishoudenBurger($huishoudenId: Int!, $burgerIds: [Int]!) {
        addHuishoudenBurger(huishoudenId: $huishoudenId, burgerIds: $burgerIds){
            ok
        }
    }
`;