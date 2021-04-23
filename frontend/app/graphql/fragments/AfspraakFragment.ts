import {gql} from "@apollo/client";
import {BetaalinstructieFragment} from "./BetaalinstructieFragment";
import {RekeningFragment} from "./RekeningFragment";
import {RubriekFragment} from "./RubriekFragment";

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        omschrijving
        bedrag
        credit
        betaalinstructie{
            ...Betaalinstructie
        }
        zoektermen
        validFrom
        validThrough
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
            tegenRekening {
                id
                iban
                rekeninghouder
            }
        }
    }
    ${RekeningFragment}
    ${RubriekFragment}
    ${BetaalinstructieFragment}
`;