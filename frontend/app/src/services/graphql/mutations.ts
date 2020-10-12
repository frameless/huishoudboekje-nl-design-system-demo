import {gql} from "@apollo/client";
import {GebruikerFragment} from "./fragments";

export const CreateGebruikerMutation = gql`
    mutation createGebruiker(
        $voorletters: String
        $voornamen: String
        $achternaam: String
        $geboortedatum: String
        $straatnaam: String
        $huisnummer: String
        $postcode: String
        $woonplaatsnaam: String
        $telefoonnummer: String
        $email: String
        $iban: String
    ) {
        createGebruiker(
            voorletters: $voorletters
            voornamen: $voornamen
            achternaam: $achternaam
            geboortedatum: $geboortedatum
            straatnaam: $straatnaam
            huisnummer: $huisnummer
            postcode: $postcode
            woonplaatsnaam: $woonplaatsnaam
            telefoonnummer: $telefoonnummer
            email: $email
            iban: $iban
        ){
            ok
            gebruiker {
                ...Gebruiker
            }
        }
    }
    ${GebruikerFragment}
`;