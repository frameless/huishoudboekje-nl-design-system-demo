import {gql} from "@apollo/client";

export const GetSimilarAfspraken = gql`
	query getSimilarAfspraken($ids: [Int]) {
		afspraken(ids: $ids){
			id
            similarAfspraken {
                id
                omschrijving
                bedrag
                credit
                zoektermen
                validThrough
                validFrom
                burger {
                    voorletters
                    voornamen
                    achternaam
                }
            }
        }
	}
`;