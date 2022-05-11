import {gql} from "@apollo/client";
import BanktransactieFragment from "./fragments/Banktransactie";

const getBanktransactieQuery = gql`
    query getBanktransactie($id: Int!){
        banktransactie(id: $id){
            ...Banktransactie
        }
    }
    ${BanktransactieFragment}
`;

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