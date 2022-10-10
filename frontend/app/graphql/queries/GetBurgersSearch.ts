import {gql} from "@apollo/client";

// This query is used in a page where we want to search for burgers.
// We don't need all the information, just whatever is actually visible on the page.
export const GetBurgersSearchQuery = gql`
	query getBurgersSearch($search: DynamicType) {
		burgers(search: $search) {
			id
			voornamen
			achternaam
		}
	}
`;
