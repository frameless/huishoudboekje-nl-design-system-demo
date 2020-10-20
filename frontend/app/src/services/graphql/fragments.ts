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

export const OrganisatieKvkDetailsFragment = gql`
    fragment Kvk on Organisatie {
        kvkDetails {
            huisnummer
            naam
            nummer
            plaatsnaam
            postcode
            straatnaam
        }
    }
`;

export const OrganisatieFragment = gql`
    fragment Organisatie on Organisatie {
        id
        kvkNummer
        weergaveNaam
        ...Kvk
    }
    ${OrganisatieKvkDetailsFragment}
`;