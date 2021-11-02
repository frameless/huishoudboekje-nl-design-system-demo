import {gql} from "@apollo/client";

export const UpdatePostadresMutation = gql`
    mutation updatePostadres($id: String!, $straatnaam: String, $huisnummer: String, $postcode: String, $plaatsnaam: String){
        updatePostadres(
            id: $id,
            straatnaam: $straatnaam,
            huisnummer: $huisnummer,
            postcode: $postcode,
            plaatsnaam: $plaatsnaam
        ){
            ok
        }
    }
`;