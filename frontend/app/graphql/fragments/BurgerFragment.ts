import {gql} from "@apollo/client";
import {AfspraakFragment} from "./AfspraakFragment";
import {RekeningFragment} from "./RekeningFragment";

export const BurgerFragment = gql`
    fragment Burger on Burger {
        id
        email
        telefoonnummer
        voorletters
        voornamen
        achternaam
        geboortedatum
        straatnaam
        huisnummer
        postcode
        plaatsnaam
        rekeningen {
            ...Rekening
        }
        afspraken {
            ...Afspraak
        }
    }
    ${AfspraakFragment}
    ${RekeningFragment}
`;