import {gql} from "@apollo/client";

//Werkt omdat elke burger automatisch een huishouden krijgt
//Huishoudens zijn nu nog alleen een id, geen extra informatie, als er informatie bij komt werkt dit niet meer
export const GetHuishoudensQuery = gql`
	query getHuishoudens {
		burgers {
			id
			voorletters
			voornamen
			achternaam
			huishoudenId
		}
	}
`;
