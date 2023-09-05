import {gql} from "@apollo/client";

export const GetSimpleBurgersQuery = gql`
    query getSimpleBurgers {
        burgers {
            id
            bsn
            voorletters
            achternaam
        }
    }
`;