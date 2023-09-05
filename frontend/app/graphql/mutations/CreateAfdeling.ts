import {gql} from "@apollo/client";

export const CreateAfdelingMutation = gql`
    mutation createAfdeling(
        $naam: String!
        $organisatieId: Int!
        $postadressen: [CreatePostadresInput]
        $rekeningen: [RekeningInput]
    ){
        createAfdeling(
            input: {
                naam: $naam,
                organisatieId: $organisatieId,
                postadressen: $postadressen,
                rekeningen: $rekeningen,
            }
        ){
            ok
            afdeling {
                id
                naam
                organisatie {
                    id
                    kvknummer
                    vestigingsnummer
                    naam
                }
                postadressen {
                    id
                    straatnaam
                    huisnummer
                    postcode
                    plaatsnaam
                }
                rekeningen {
                    id
                    iban
                    rekeninghouder
                }
            }
        }
    }
`;