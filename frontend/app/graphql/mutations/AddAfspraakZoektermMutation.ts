import {gql} from "@apollo/client";

export const AddAfspraakZoektermMutation = gql`
	mutation addAfspraakZoekterm($afspraakId: Int!, $zoekterm: String!) {
		addAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm){
			ok
			matchingAfspraken{
				id
				zoektermen
				bedrag
				burger{
					id
					voorletters
					voornamen
					achternaam
				}
				tegenRekening{
					rekeninghouder
					iban
				}
			}
		}
	}
`;