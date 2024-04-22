import {gql} from "@apollo/client";

export const SubscribeToNotifications = gql`
    Subscription {
        notification {
            message,
            title,
            additionalProperties {
                key,
                value
            }
        }
    }
`;