import {gql} from "@apollo/client";

export const GetTransactieQuery = gql`
	query getTransactie($id: Int!) {
		bankTransaction(id: $id){
			id
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
			suggesties {
				id
				omschrijving
				bedrag
				credit
				zoektermen
				burger {
					voornamen
					voorletters
					achternaam
				}
			}
		}
		rubrieken {
			id
			naam
			grootboekrekening {
				id
			}
		}
	}
`;