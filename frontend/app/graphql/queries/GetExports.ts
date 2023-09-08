import {gql} from "@apollo/client";

export const GetExportsQuery = gql`
    query getExports {
        exports {
            id
            naam
            timestamp
            startDatum
            eindDatum
            verwerkingDatum
            sha256
            overschrijvingen {
                id
                bedrag
            }
        }
    }
`;