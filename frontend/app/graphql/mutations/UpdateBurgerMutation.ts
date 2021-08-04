import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/BurgerFragment";

export const UpdateBurgerMutation = gql`
    mutation updateBurger(
        $id: Int!
        $bsn: Int
        $voorletters: String
        $voornamen: String
        $achternaam: String
        $geboortedatum: String
        $straatnaam: String
        $huisnummer: String
        $postcode: String
        $plaatsnaam: String
        $telefoonnummer: String
        $email: String
    ){
        updateBurger(
            id: $id
            bsn: $bsn
            voorletters: $voorletters
            voornamen: $voornamen
            achternaam: $achternaam
            geboortedatum: $geboortedatum
            straatnaam: $straatnaam
            huisnummer: $huisnummer
            postcode: $postcode
            plaatsnaam: $plaatsnaam
            telefoonnummer: $telefoonnummer
            email: $email
        ){
            ok
            burger {
                ...Burger
            }
        }
    }
    ${BurgerFragment}
`;