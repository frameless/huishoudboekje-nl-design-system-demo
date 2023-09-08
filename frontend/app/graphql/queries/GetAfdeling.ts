import {gql} from "@apollo/client";

export const GetAfdelingQuery = gql`
    query getAfdeling($id: Int!) {
        afdeling(id: $id){
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
`;