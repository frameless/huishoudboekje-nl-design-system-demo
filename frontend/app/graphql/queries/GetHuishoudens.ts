import {gql} from "@apollo/client";

export const GetHuishoudensQuery = gql`
	query getHuishoudens {
		huishoudens {
			id
			burgers {
				id
				voorletters
				voornamen
				achternaam
			}
		}
	}
`;
