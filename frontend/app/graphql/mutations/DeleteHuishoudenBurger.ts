import {gql} from "@apollo/client";

export const DeleteHuishoudenBurger = gql`
    mutation deleteHuishoudenBurger($huishoudenId: Int!, $burgerIds: [Int]!) {
        deleteHuishoudenBurger(huishoudenId: $huishoudenId, burgerIds: $burgerIds){
            ok
        }
    }
`;