import {gql} from "@apollo/client";
import {OrganisatieKvkDetailsFragment} from "./OrganisatieKvkDetailsFragment";
import {RekeningFragment} from "./RekeningFragment";

export const OrganisatieFragment = gql`
    fragment Organisatie on Organisatie {
        id
        kvkNummer
        vestigingsnummer
        rekeningen {
            ...Rekening
        }
        ...Kvk
    }
    ${RekeningFragment}
    ${OrganisatieKvkDetailsFragment}
`;