import {gql} from "@apollo/client";

export const UpdateAfspraakBetaalinstructieMutation = gql`
    mutation updateAfspraakBetaalinstructie($id: Int!, $betaalinstructie: BetaalinstructieInput!) {
        updateAfspraakBetaalinstructie(afspraakId: $id, betaalinstructie: $betaalinstructie){
            ok
        }
    }
`;