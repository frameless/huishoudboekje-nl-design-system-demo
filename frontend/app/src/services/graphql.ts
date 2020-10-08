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
    }`

export const GetGebruikersQuery = gql`
    query {
        gebruikers {
            id
            telefoonnummer
            email
            geboortedatum
            ...Burger
        }
    }
    ${BurgerFragment}
`

// export const CreateGebruikerMutation = gql`
//     mutation createGebruiker(
//         $achternaam: String
//         $email: String
//         $geboortedatum: String
//         $huisnummer: String
//         $postcode: String
//         $straatnaam: String
//         $telefoonnummer: String
//         $voorletters: String
//         $voornamen: String
//         $woonplaatsnaam: String
//     ) {
//         createGebruiker(
//             achternaam: $achternaam
//             email: $email
//             geboortedatum: $geboortedatum
//             huisnummer: $huisnummer
//             postcode: $postcode
//             straatnaam: $straatnaam
//             telefoonnummer: $telefoonnummer
//             voorletters: $voorletters
//             voornamen: $voornamen
//             woonplaatsnaam: $woonplaatsnaam
//         ){
//             ok
//             gebruiker {
//                 id
//             }
//         }
//     }`