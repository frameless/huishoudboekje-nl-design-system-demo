import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";
import {GrootboekrekeningFragment} from "../fragments/Grootboekrekening";
import {TransactieFragment} from "../fragments/Transactie";

export const GetTransactieQuery = gql`
	query getTransactie($id: Int!) {
		bankTransaction(id: $id){
			...BankTransaction
			journaalpost {
				id
				isAutomatischGeboekt
				afspraak {
					...Afspraak
					rubriek{
						id
						naam
					}
				}
				grootboekrekening {
					...Grootboekrekening
					rubriek {
						id
						naam
					}
				}
			}
			suggesties {
				...Afspraak
			}
		}
		rubrieken {
			...Rubriek
			grootboekrekening{
				id
				naam
			}
		}
		afspraken {
			...Afspraak
		}
	}
	${AfspraakFragment}
	${TransactieFragment}
	${GrootboekrekeningFragment}
`;
