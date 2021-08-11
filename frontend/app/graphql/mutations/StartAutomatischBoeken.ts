import {gql} from "@apollo/client";

export const StartAutomatischBoekenMutation = gql`
    mutation startAutomatischBoeken{
        startAutomatischBoeken{
            ok
            journaalposten {
                id
            }
        }
    }
`;