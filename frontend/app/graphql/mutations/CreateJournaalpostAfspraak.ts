import {gql} from "@apollo/client";

export const CreateJournaalpostAfspraakMutation = gql`
    mutation createJournaalpostAfspraak($transactionId: Int!, $afspraakId: Int!, $isAutomatischGeboekt: Boolean = false){
        createJournaalpostAfspraak(input: [{
            transactionId: $transactionId,
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
