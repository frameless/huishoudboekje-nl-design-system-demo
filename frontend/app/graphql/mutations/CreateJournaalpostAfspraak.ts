import {gql} from "@apollo/client";

export const CreateJournaalpostAfspraakMutation = gql`
    mutation createJournaalpostAfspraak($transactionId: String!, $afspraakId: Int!, $isAutomatischGeboekt: Boolean = false){
        createJournaalpostAfspraak(input: [{
            transactionUuid: $transactionId,
            afspraakId: $afspraakId,
            isAutomatischGeboekt: $isAutomatischGeboekt
        }]){
            ok
            journaalposten {
                id
                afspraak {
                    id
                }
            }
        }
    }
`;
