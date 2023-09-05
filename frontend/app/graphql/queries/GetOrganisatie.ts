import {gql} from "@apollo/client";

export const GetOrganisatieQuery = gql`
    query getOrganisatie($id: Int!) {
        organisatie(id: $id){
            id
            naam
            kvknummer
            vestigingsnummer
            afdelingen {
                id
                naam
            }
        }
    }
`;