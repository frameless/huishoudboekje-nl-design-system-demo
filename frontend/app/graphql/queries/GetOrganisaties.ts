import {gql} from "@apollo/client";

export const GetOrganisatiesQuery = gql`
    query getOrganisaties {
        organisaties {
            id
            naam
            kvknummer
            vestigingsnummer
            afdelingen {
                id
                naam
                organisatie {
                    id
                    kvknummer
                    vestigingsnummer
                    naam
                }
                postadressen {
                    id
                    straatnaam
                    huisnummer
                    postcode
                    plaatsnaam
                }
                rekeningen {
                    id
                    iban
                    rekeninghouder
                }
            }
        }
    }
`;

export const GetSimpleOrganisatiesQuery = gql`
    query getSimpleOrganisaties {
        organisaties {
            id
            naam
        }
    }
`;