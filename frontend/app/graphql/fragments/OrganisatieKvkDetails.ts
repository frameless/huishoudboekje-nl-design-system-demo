import {gql} from "@apollo/client";

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