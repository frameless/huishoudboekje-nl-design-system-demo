import {gql} from "@apollo/client";
import {BetaalinstructieFragment} from "./BetaalinstructieFragment";
import {OrganisatieFragment} from "./OrganisatieFragment";
import {RekeningFragment} from "./RekeningFragment";
import {RubriekFragment} from "./RubriekFragment";

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
        organisatie {
            ...Organisatie
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
    ${OrganisatieFragment}
    ${RubriekFragment}
    ${BetaalinstructieFragment}
`;