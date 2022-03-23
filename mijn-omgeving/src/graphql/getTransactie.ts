import {gql} from "@apollo/client";
import BanktransactieFragment from "./fragments/Banktransactie";

const getBanktransactieQuery = gql`
    query getBanktransactie($id: Int!){
        banktransactie(id: $id){
            ...Banktransactie
        }
    }
    ${BanktransactieFragment}
`;