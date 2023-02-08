import {gql} from "@apollo/client";
import {SignaalFragment} from "../fragments/Signaal";

export const GetSignalenAndBurgersQuery = gql`
    query getSignalenAndBurgers {
        signalen {
            id
            ...Signaal
        }
        burgers {
            id
            voorletters
            voornamen
            achternaam
        }
    }
    ${SignaalFragment}
`;

export const GetSignalenQuery = gql`
    query getSignalen {
        signalen {
            id
            isActive
        }
    }
`;