import {gql} from "@apollo/client";
import {BetaalinstructieFragment} from "./Betaalinstructie";
import {RekeningFragment} from "./Rekening";
import {RubriekFragment} from "./Rubriek";

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        omschrijving
        bedrag
        credit
        betaalinstructie {
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
        rubriek {
            ...Rubriek
        }
        matchingAfspraken {
            id
            credit
            burger {
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