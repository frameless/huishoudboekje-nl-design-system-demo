import {gql} from "@apollo/client";

export const GetSaldoQuery = gql`
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