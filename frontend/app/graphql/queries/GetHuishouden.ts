import {gql} from "@apollo/client";

export const GetHuishoudenQuery = gql`
	query getHuishouden($id: Int!) {
		huishouden(id: $id) {
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
