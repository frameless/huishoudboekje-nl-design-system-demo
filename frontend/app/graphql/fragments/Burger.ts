import {gql} from "@apollo/client";
import {AfspraakFragment} from "./Afspraak";
import {HuishoudenFragment} from "./Huishouden";
import {RekeningFragment} from "./Rekening";

export const BurgerFragment = gql`
    fragment Burger on Burger {
        id
        bsn
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
        huishouden {
            id
            burgers {
                id
            }
        }
    }
    ${HuishoudenFragment}
    ${AfspraakFragment}
    ${RekeningFragment}
`;