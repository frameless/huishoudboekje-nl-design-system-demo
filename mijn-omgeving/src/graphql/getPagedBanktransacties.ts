import {gql} from "@apollo/client";
import PagedBanktransactiesFragment from "./fragments/PagedBanktransacties";

const getPagedBanktransactiesQuery = gql`
    query getPagedBanktransacties($bsn: Int!, $start: Int!, $limit: Int!) {
        burger(bsn: $bsn){
            banktransactiesPaged (start: $start, limit: $limit){
                ...PagedBanktransacties
            }
        }
    }
    ${PagedBanktransactiesFragment}
`;