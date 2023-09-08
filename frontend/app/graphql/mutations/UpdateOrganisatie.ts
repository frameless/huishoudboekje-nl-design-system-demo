import {gql} from "@apollo/client";

export const UpdateOrganisatieMutation = gql`
    mutation updateOrganisatie(
        $id: Int!
        $kvknummer: String
        $vestigingsnummer: String
        $naam: String
    ) {
        updateOrganisatie(
            id: $id
            kvknummer: $kvknummer
            vestigingsnummer: $vestigingsnummer
            naam: $naam
        ){
            ok
            organisatie {
                id
                naam
                kvknummer
                vestigingsnummer
                afdelingen {
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
    }
`;