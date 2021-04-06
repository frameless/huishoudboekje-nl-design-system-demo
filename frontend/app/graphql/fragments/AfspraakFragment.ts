import {gql} from "@apollo/client";
import {RekeningFragment} from "./RekeningFragment";
import {RubriekFragment} from "./RubriekFragment";

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        omschrijving
        startDatum
        eindDatum
        aantalBetalingen
        automatischeIncasso
        automatischBoeken
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
    }
    ${RekeningFragment}
    ${RubriekFragment}
`;