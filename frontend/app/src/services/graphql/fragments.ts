import {gql} from "@apollo/client";

export const GebruikerFragment = gql`
    fragment Gebruiker on Gebruiker {
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
        iban
    }
`;