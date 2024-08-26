import {gql} from "@apollo/client";

export const CreateJournaalpostGrootboekrekeningMutation = gql`
    mutation createJournaalpostGrootboekrekening($transactionId: String! $grootboekrekeningId: String!){
        createJournaalpostGrootboekrekening(input: {
            transactionUuid: $transactionId,
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