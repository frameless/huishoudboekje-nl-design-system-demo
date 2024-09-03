import {gql} from "@apollo/client";

export const GetHuishoudenOverzichtQuery = gql`
    query getHuishoudenOverzicht($burgers:[Int!]!,$start:String!,$end:String!) {
		overzicht(burgerIds:$burgers startDate:$start, endDate:$end) {
			afspraken {
				id
				burgerId
				omschrijving
				rekeninghouder
				validFrom
				validThrough
				transactions {
					uuid
					informationToAccountOwner
					statementLine
					bedrag
					isCredit
					tegenRekeningIban
					transactieDatum
					tegenRekening {
						rekeninghouder
					}
				}
			}
			saldos {
				maandnummer
				startSaldo
				eindSaldo
				mutatie
			}
		}
	}
`;