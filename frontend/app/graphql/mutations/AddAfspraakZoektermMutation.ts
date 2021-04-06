import {gql} from "@apollo/client";
import {AfspraakFragment} from "../fragments/AfspraakFragment";

export const AddAfspraakZoektermMutation = gql`
    mutation addAfspraakZoekterm($afspraakId: Int!, $zoekterm: String!) {
        addAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm){
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