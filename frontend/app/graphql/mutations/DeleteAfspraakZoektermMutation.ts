import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";

export const DeleteAfspraakZoektermMutation = gql`
    mutation deleteAfspraakZoekterm($afspraakId: Int!, $zoekterm: String!){
        deleteAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm){
            ok
            afspraak{
                ...Afspraak
            }
            matchingAfspraken{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;