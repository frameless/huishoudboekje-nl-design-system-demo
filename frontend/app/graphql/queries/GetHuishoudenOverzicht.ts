import {gql} from "@apollo/client";

export const GetHuishoudenOverzichtQuery = gql`
    query getHuishoudenOverzicht($burgers:[Int!]!,$start:String!,$end:String!) {
		overzicht(burgerIds:$burgers startDate:$start, endDate:$end) {
			id
			burgerId
			organisatieId
			omschrijving
			rekeninghouder
            tegenRekeningId
            validFrom
            validThrough
            transactions {
                id
                informationToAccountOwner
                statementLine
                bedrag
                isCredit
                tegenRekeningIban
                transactieDatum
            }
		}
	}
`;