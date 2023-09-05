import {gql} from "@apollo/client";

export const UpdateAfdelingMutation = gql`
    mutation updateAfdeling(
        $id: Int!
        $naam: String
		$organisatieId: Int
    ){
        updateAfdeling(
            id: $id
            naam: $naam
			organisatieId: $organisatieId
        ){
            ok
            afdeling {
                id
                naam
                organisatie {
                    id
                    kvknummer
                    vestigingsnummer
                    naam
                }
                postadressen {
                    id
                    straatnaam
                    huisnummer
                    postcode
                    plaatsnaam
                }
                rekeningen {
                    id
                    iban
                    rekeninghouder
                }
            }
        }
    }
`;