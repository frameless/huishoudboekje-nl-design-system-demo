import {gql} from "@apollo/client";
import {GebruikersactiviteitFragment} from "../fragments/Gebruikersactiviteit";

export const GetBurgerGebeurtenissenQuery = gql`
	query GetBurgerGebeurtenissen($ids: [Int!]!, $limit: Int!, $offset: Int!) {
		burgers(ids: $ids) {
			id
			voornamen
			voorletters
			achternaam
		}
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
