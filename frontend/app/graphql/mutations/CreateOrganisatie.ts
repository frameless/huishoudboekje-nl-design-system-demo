import {gql} from "@apollo/client";

export const CreateOrganisatieMutation = gql`
    mutation createOrganisatie(
        $kvknummer: String!
        $vestigingsnummer: String!
        $naam: String
    ){
        createOrganisatie(
            input: {
                kvknummer: $kvknummer
                vestigingsnummer: $vestigingsnummer
                naam: $naam
            }
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