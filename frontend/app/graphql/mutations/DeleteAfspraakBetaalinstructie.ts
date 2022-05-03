import {gql} from "@apollo/client";

export const DeleteAfspraakBetaalinstructieMutation = gql`
    mutation deleteAfspraakBetaalinstructie($id: Int!) {
        deleteAfspraakBetaalinstructie(afspraakId: $id){
            ok
        }
    }
`;