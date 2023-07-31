import {gql} from "@apollo/client";

export const CreateExportOverschrijvingenMutation = gql`
    mutation createExportOverschrijvingen($startDatum: String!, $eindDatum: String!, $verwerkingDatum: String) {
        createExportOverschrijvingen(startDatum: $startDatum, eindDatum: $eindDatum, verwerkingDatum: $verwerkingDatum){
            ok
            export{
                id
            }
        }
    }
`;