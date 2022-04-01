import {gql} from "@apollo/client";
import BanktransactieFragment from "./fragments/Banktransactie";

const getPagedBanktransactiesQuery = gql`
    query getPagedBanktransacties($bsn: Int!, $start: Int!, $limit: Int!) {
        burger(bsn: $bsn){
            banktransactiesPaged (start: $start, limit: $limit){
                banktransacties {
                    ...Banktransactie
                }
                pageInfo {
                    count
                    limit
                    start
                }
            }
        }
    }
    ${BanktransactieFragment}
`;