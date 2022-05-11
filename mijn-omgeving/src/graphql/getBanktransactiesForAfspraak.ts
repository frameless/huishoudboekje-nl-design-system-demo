import {gql} from "@apollo/client";
import BanktransactieFragment from "./fragments/Banktransactie";

const getBanktransactiesForAfspraakQuery = gql`
    query getBanktransactiesForAfspraak($bsn: Int!, $afspraakId: Int!){
        burger(bsn: $bsn){
            afspraak(id: $afspraakId){
                journaalposten {
                    banktransactie {
                        ...Banktransactie
                    }
                }
            }
        }
    }
    ${BanktransactieFragment}
`;