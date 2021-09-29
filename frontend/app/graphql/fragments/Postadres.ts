import {gql} from "@apollo/client";

export const PostadresFragment = gql`
    fragment Postadres on Postadres {
        id
        straatnaam
        huisnummer
        postcode
        plaatsnaam
    }
`;