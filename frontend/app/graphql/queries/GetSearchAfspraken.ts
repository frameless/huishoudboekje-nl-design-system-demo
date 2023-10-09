import {gql} from "@apollo/client";

export const GetSearchAfspraken = gql`
    query getSearchAfspraken($offset: Int, $limit: Int, $afspraken: [Int], $afdelingen: [Int], $tegenrekeningen: [Int], $burgers: [Int], $only_valid: Boolean, $min_bedrag: Int, $max_bedrag: Int, $zoektermen: [String]) {
            searchAfspraken(offset:$offset, limit:$limit, afspraakIds: $afspraken, afdelingIds: $afdelingen, tegenRekeningIds: $tegenrekeningen, burgerIds: $burgers, onlyValid: $only_valid, minBedrag: $min_bedrag, maxBedrag: $max_bedrag, zoektermen: $zoektermen){
            afspraken{
				id
				omschrijving
				bedrag
				credit
				zoektermen
                validFrom
                validThrough
				burger {
                    id
					voornamen
					voorletters
					achternaam
				}
            }
            pageInfo{
                count
                limit
                start
            }
        }
    }
`;