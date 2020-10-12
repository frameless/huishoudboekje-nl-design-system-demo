import {gql} from "@apollo/client";

const BurgerFragment = gql`
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

const GebruikerFragment = gql`
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

// Todo: check if this works (because DB was empty when testing)
export const GetAllGebruikersQuery = gql`
    query getAllGebruikers {
        gebruikers {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;

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
`