import {gql} from "@apollo/client";
import {HuishoudenFragment} from "../fragments/HuishoudenFragment";

export const GetHuishoudensQuery = gql`
    query getHuishouden($id: Int!) {
        huishouden(id: $id) {
            ...Huishouden
        }
    }
    ${HuishoudenFragment}
`;