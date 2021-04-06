import {gql} from "@apollo/client";
import {GebruikersactiviteitFragment} from "../fragments/GebruikersactiviteitFragment";

export const GetGebeurtenissenQuery = gql`
    query GetGebeurtenissen($limit: Int!, $offset: Int!) {
        gebruikersactiviteitenPaged(start: $offset, limit: $limit) {
            gebruikersactiviteiten{
                ...Gebruikersactiviteit
            }
            pageInfo{
                count
            }
        }
    }
    ${GebruikersactiviteitFragment}
`;