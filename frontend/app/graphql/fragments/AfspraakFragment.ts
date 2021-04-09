import {gql} from "@apollo/client";
import {RekeningFragment} from "./RekeningFragment";
import {RubriekFragment} from "./RubriekFragment";

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        omschrijving
        interval {
            dagen
            weken
            maanden
            jaren
        }
        burger {
            id
            voornamen
            voorletters
            achternaam
            plaatsnaam
            rekeningen {
                ...Rekening
            }
        }
        tegenRekening {
            ...Rekening
        }
        organisatie {
            id
            weergaveNaam
            kvkDetails {
                naam
                plaatsnaam
            }
        }
        bedrag
        credit
        zoektermen
        actief
        rubriek {
            ...Rubriek
        }
        matchingAfspraken {
            id
            credit
            burger{
                voorletters
                voornamen
                achternaam
            }
            zoektermen
            bedrag
            omschrijving
            interval {
                dagen
                weken
                maanden
                jaren
            }
            tegenRekening {
                id
                iban
                rekeninghouder
            }
        }
    }
    ${RekeningFragment}
    ${RubriekFragment}
`;