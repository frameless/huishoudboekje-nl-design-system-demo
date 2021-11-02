import {gql} from "@apollo/client";
import {AfdelingFragment} from "./Afdeling";

export const OrganisatieFragment = gql`
    fragment Organisatie on Organisatie {
        id
        naam
        kvknummer
        vestigingsnummer
        afdelingen {
            ...Afdeling
        }
    }
    ${AfdelingFragment}
`;