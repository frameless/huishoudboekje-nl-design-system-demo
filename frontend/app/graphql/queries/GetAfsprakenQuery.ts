import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";

export const GetAfsprakenQuery = gql`
    query getAfspraken {
        afspraken{
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;