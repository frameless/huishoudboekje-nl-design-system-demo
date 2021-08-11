import {gql} from "@apollo/client";

export const GrootboekrekeningFragment = gql`
    fragment Grootboekrekening on Grootboekrekening {
        id
        naam
        credit
        omschrijving
        referentie
        rubriek{
            id
            naam
        }
    }
`;