import {gql} from "@apollo/client";

export const GetSearchAfspraken = gql`
    query getSearchAfspraken($offset: Int, $limit: Int, $afspraken: [Int], $afdelingen: [Int], $burgers: [Int], $only_valid: Boolean, $min_bedrag: Int, $max_bedrag: Int) {
            searchAfspraken(offset:$offset, limit:$limit, afspraakIds: $afspraken, afdelingIds: $afdelingen, burgerIds: $burgers, onlyValid: $only_valid, minBedrag: $min_bedrag, maxBedrag: $max_bedrag){
            afspraken{
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
            pageInfo{
                count
                limit
                start
            }
        }
    }
`;