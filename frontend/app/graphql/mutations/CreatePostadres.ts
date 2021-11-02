import {gql} from "@apollo/client";

export const CreateAfdelingPostadresMutation = gql`
    mutation createAfdelingPostadres(
        $afdelingId: Int!
        $huisnummer: String!
        $plaatsnaam: String!
        $postcode: String!
        $straatnaam: String!
    ){
        createPostadres(
            input: {
                afdelingId: $afdelingId
                huisnummer: $huisnummer
                plaatsnaam: $plaatsnaam
                postcode: $postcode
                straatnaam: $straatnaam
            }
        ){
            ok
            postadres {
                id
            }
        }
    }
`;