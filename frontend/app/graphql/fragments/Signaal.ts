import {gql} from "@apollo/client";

export const SignaalFragment = gql`
    fragment Signaal on Signal {
        id
        isActive
        type
        actions
        context
        alarm {
            id
        }
        timeCreated
    }
`;