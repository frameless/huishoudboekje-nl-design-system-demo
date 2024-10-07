import {useToast} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {gql, useSubscription} from "@apollo/client";
import {Refetcher} from "./Refetcher";
import {Refetch} from "../../generated/graphql";


// Generation of the graphql.tsx file for some reason does not create this despite being listed as a type
const SubscribeToRefetch = gql`
    subscription {
        refetch {
            type
            variables {
                key
            }
        }
    }
`;

export const useRefetcher = () => {
    const refetcher = new Refetcher()

    const callback = (data) => {
        refetcher.Refetch(data.data.data.refetch.type.toLowerCase())
    }


    return useSubscription(SubscribeToRefetch, {
        onError: (err) => console.error("error", err),
        onData: (data) => callback(data),
    })

}
