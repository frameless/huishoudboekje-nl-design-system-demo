import {gql} from "@apollo/client";

export const GetTransactieQuery = gql`
	query getTransactie($uuid: String!) {
		bankTransaction(uuid: $uuid){
			uuid
			informationToAccountOwner
			statementLine
			bedrag
			isCredit
			tegenRekeningIban
			tegenRekening {
				iban
				rekeninghouder
			}
			transactieDatum
			journaalpost {
				id
				isAutomatischGeboekt
				afspraak {
					id
					omschrijving
					bedrag
					credit
					zoektermen
					burger {
						voornamen
						voorletters
						achternaam
						id
					}
					rubriek{
						id
						naam
					}
				}
				grootboekrekening {
					id
					naam
					credit
					omschrijving
					referentie
					rubriek{
						id
						naam
					}
				}
			}
		}
	}
`;