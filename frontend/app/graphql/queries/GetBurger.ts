import {gql} from "@apollo/client";

// Used on the burger detail page
export const GetBurgerDetailsQuery = gql`
	query getBurgerDetails($id: Int!) {
		burger(id: $id) {
			id
			voorletters
			voornamen
			achternaam
			huishouden {
				id
			}
			afspraken {
				id
				bedrag
				credit
				omschrijving
				validFrom
				validThrough
				betaalinstructie {
					byDay
					byMonth
					byMonthDay
					exceptDates
					repeatFrequency
					startDate
					endDate
				}
				tegenRekening {
					id
					iban
					rekeninghouder
				}
				afdeling {
					naam
					organisatie {
						naam
					}
				}
			}
		}
	}
`;

// Used on the page with personal details
export const GetBurgerPersonalDetailsQuery = gql`
	query getBurgerPersonalDetails($id: Int!) {
		burger(id: $id) {
			id
			bsn
			voorletters
			voornamen
			achternaam
			geboortedatum
			straatnaam
			huisnummer
			postcode
			plaatsnaam
			telefoonnummer
			email
			rekeningen {
				id
				iban
				rekeninghouder
			}
		}
	}
`;
