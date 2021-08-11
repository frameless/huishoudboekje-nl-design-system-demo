import {gql} from "@apollo/client";
import {HuishoudenFragment} from "../fragments/HuishoudenFragment";

export const CreateHuishoudenMutation = gql`
    mutation createHuishouden($burgerIds: [Int] = []) {
        createHuishouden(input: {
            burgerIds: $burgerIds
        }){
            ok
            huishouden {
                ...Huishouden
            }
        }
    }
    ${HuishoudenFragment}
`;