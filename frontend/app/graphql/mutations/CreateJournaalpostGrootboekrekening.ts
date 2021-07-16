import {gql} from "@apollo/client";

export const CreateJournaalpostGrootboekrekeningMutation = gql`
    mutation createJournaalpostGrootboekrekening($transactionId: Int! $grootboekrekeningId: String!){
        createJournaalpostGrootboekrekening(input: {
            transactionId: $transactionId,
            grootboekrekeningId: $grootboekrekeningId,
            isAutomatischGeboekt: false,
        }){
            ok
            journaalpost{
                id
            }
        }
    }
`;