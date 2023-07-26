import {gql} from "@apollo/client";

export const ExportFragment = gql`
    fragment Export on Export {
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
`;