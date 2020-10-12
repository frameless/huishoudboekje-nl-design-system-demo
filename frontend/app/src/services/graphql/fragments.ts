import {gql} from "@apollo/client";

export const BurgerFragment = gql`
    fragment Burger on Gebruiker {
        burger {
            achternaam
            huisnummer
            postcode
            straatnaam
            voorletters
            voornamen
            woonplaatsnaam
        }
    }
`;

export const GebruikerFragment = gql`
    fragment Gebruiker on Gebruiker {
        id
        weergaveNaam
        email
        geboortedatum
        telefoonnummer
        iban
        ...Burger
    }
    ${BurgerFragment}
`;