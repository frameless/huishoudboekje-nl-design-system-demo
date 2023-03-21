import {gql} from "@apollo/client";

export const GetRubriekenQuery = gql`
    query getRubrieken {
        rubrieken{
            id
            naam
            grootboekrekening{
                id
                naam
            }
        }
    }
`;