import {gql} from "@apollo/client";
import {HuishoudenFragment} from "../fragments/Huishouden";

export const GetHuishoudensQuery = gql`
    query getHuishoudens {
        huishoudens {
            ...Huishouden
        }
    }
    ${HuishoudenFragment}
`;