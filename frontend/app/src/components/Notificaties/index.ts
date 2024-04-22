import {useToast} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {gql, useSubscription} from "@apollo/client";


// Generation of the graphql.tsx file for some reason does not create this despite being listed as a type
const SubscribeToNotifications = gql`
    subscription {
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

export const useNotifications = () => {
    const toast = useToast()
    const {t} = useTranslation(["notifications"])

    const callback = (data) => {
        const notification = data.data.data.notification
        const tMessage = notification.message
        const tTitle = notification.title != null ? notification.title : "default.title"
        const tProperties: {[key: string]: string} = {};
        if (notification.additionalProperties != null) {
            notification.additionalProperties.forEach(pair => {
                tProperties[pair.key] = pair.value;
            });
        }

        const description = notification.additionalProperties != null ? t(tMessage, tProperties) : t(tMessage)
        toast({
            position: "top-right",
            title: t(tTitle),
            description: description,
            isClosable: true
        })
    }


    return useSubscription(SubscribeToNotifications, {
        onError: (err) => console.error("error", err),
        onData: (data) => callback(data),
    })

}
