import {gql} from "@apollo/client";

export const CreateExportOverschrijvingenMutation = gql`
    mutation createExportOverschrijvingen($startDatum: String!, $eindDatum: String!) {
        createExportOverschrijvingen(startDatum: $startDatum, eindDatum: $eindDatum){
            ok
            export{
                id
            }
        }
    }
`;