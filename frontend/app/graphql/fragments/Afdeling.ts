import {gql} from "@apollo/client";
import {OrganisatieFragment} from "./Organisatie";
import {PostadresFragment} from "./Postadres";
import {RekeningFragment} from "./Rekening";

export const AfdelingFragment = gql`
    fragment Afdeling on Afdeling {
        id
        naam
        organisatie {
            id
            kvknummer
            vestigingsnummer
            naam
        }
        postadressen {
            ...Postadres
        }
        rekeningen {
            ...Rekening
        }
    }
    ${OrganisatieFragment}
    ${PostadresFragment}
    ${RekeningFragment}
`;