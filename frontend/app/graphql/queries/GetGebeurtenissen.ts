import {gql} from "@apollo/client";
import {GebruikersactiviteitFragment} from "../fragments/Gebruikersactiviteit";

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