import {gql} from "@apollo/client";
import {GebruikersactiviteitFragment} from "../fragments/GebruikersactiviteitFragment";

export const GetBurgerGebeurtenissenQuery = gql`
    query GetBurgerGebeurtenissen($ids: [Int!]!, $limit: Int!, $offset: Int!) {
        gebruikersactiviteitenPaged(burgerIds: $ids, start: $offset, limit: $limit) {
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