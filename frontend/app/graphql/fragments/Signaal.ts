import {gql} from "@apollo/client";
import {AfspraakFragment} from "./Afspraak";

export const SignaalFragment = gql`
    fragment Signaal on Signaal {
        id
        isActive
        type
        actions
        context
        timeUpdated
        alarm {
            id
            afspraak {
                ...Afspraak
            }
        }
        bankTransactions {
            id
        }
    }
    ${AfspraakFragment}
`;