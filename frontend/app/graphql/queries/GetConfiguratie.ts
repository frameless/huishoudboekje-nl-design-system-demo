import {gql} from "@apollo/client";

export const GetConfiguratieQuery = gql`
    query getConfiguratie {
        configuraties {
            id
            waarde
        }
    }
`;