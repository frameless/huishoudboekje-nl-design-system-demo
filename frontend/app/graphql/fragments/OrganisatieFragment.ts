import {gql} from "@apollo/client";
import {OrganisatieKvkDetailsFragment} from "./GebruikersactiviteitFragment";
import {RekeningFragment} from "./RekeningFragment";

export const OrganisatieFragment = gql`
    fragment Organisatie on Organisatie {
        id
        kvkNummer
        weergaveNaam
        rekeningen {
            ...Rekening
        }
        ...Kvk
    }
    ${RekeningFragment}
    ${OrganisatieKvkDetailsFragment}
`;