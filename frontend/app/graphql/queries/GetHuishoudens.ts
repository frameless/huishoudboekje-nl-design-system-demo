import {gql} from "@apollo/client";
import {HuishoudenFragment} from "../fragments/HuishoudenFragment";

export const GetHuishoudensQuery = gql`
    query getHuishoudens {
        huishoudens {
            ...Huishouden
        }
    }
    ${HuishoudenFragment}
`;