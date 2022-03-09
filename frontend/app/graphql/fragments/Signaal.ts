import {gql} from "@apollo/client";

export const SignaalFragment = gql`
    fragment Signaal on Signaal {
        id
        isActive
        type
        actions
        context
        alarm {
            id
        }
        bankTransactions {
            id
        }
        timeUpdated
    }
`;