import {gql} from "@apollo/client";

export const GetExportsPagedQuery = gql`
    query getExportsPaged($offset: Int!, $limit: Int!) {
        exportsPaged(offset: $offset, limit: $limit){
            exports {
                id
                naam
                timestamp
                startDatum
                eindDatum
                verwerkingDatum
                sha256
                overschrijvingen {
                    id
                    bedrag
                }
            }
            pageInfo{
                count
                limit
                start
            }
        }
    }
`;