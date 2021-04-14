import {gql} from "@apollo/client";
import {RekeningFragment} from "./RekeningFragment";
import {RubriekFragment} from "./RubriekFragment";

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        omschrijving
        bedrag
        credit
        zoektermen
        validFrom
        validThrough
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