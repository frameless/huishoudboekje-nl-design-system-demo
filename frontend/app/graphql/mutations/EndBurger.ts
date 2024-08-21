import {gql} from "@apollo/client";

export const EndBurgerMutation = gql`
    mutation endBurger($enddate: String!, $id: Int!){
        endBurger(endDate: $enddate, id: $id){
            ok
        }
    }
`;