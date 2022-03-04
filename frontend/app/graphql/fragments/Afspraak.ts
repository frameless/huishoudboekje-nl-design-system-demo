import {gql} from "@apollo/client";
import {AfdelingFragment} from "./Afdeling";
import {BetaalinstructieFragment} from "./Betaalinstructie";
import {PostadresFragment} from "./Postadres";
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
            bsn
            voornamen
            voorletters
            achternaam
            plaatsnaam
            rekeningen {
                ...Rekening
            }
        }
        afdeling {
            ...Afdeling
        }
        postadres {
            ...Postadres
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
    ${AfdelingFragment}
    ${PostadresFragment}
    ${RubriekFragment}
    ${BetaalinstructieFragment}
`;