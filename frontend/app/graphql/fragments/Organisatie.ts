import {gql} from "@apollo/client";
import {OrganisatieKvkDetailsFragment} from "./OrganisatieKvkDetails";
import {RekeningFragment} from "./Rekening";

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