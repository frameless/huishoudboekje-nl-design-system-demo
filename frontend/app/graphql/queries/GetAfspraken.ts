import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/Afspraak";

export const GetAfsprakenQuery = gql`
    query getAfspraken {
        afspraken{
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;