import {gql} from "@apollo/client";
import {SignaalFragment} from "../fragments/Signaal";

export const GetSignalenQuery = gql`
    query getSignalen {
        signalen {
            id
            ...Signaal
        }
    }
    ${SignaalFragment}
`;