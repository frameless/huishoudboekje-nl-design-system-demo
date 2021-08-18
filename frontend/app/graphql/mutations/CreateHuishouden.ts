import {gql} from "@apollo/client";
import {HuishoudenFragment} from "../fragments/Huishouden";

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
