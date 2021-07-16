import {gql} from "@apollo/client";

export const DeleteAfspraakZoektermMutation = gql`
    mutation deleteAfspraakZoekterm($afspraakId: Int!, $zoekterm: String!) {
        deleteAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm){
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