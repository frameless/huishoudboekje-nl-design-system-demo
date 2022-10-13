import {gql} from "@apollo/client";

export const GetBurgersQuery = gql`
	query getBurgers {
		burgers {
			id
			voornamen
			achternaam
			straatnaam
			huisnummer
			postcode
			plaatsnaam
		}
	}
`;
