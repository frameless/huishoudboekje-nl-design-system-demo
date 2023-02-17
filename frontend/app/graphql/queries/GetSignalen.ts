import {gql} from "@apollo/client";

export const GetSignalenAndBurgersQuery = gql`
    query getSignalenAndBurgers {
        signalen {
            id
            isActive
            type
            actions
            bedragDifference
            timeUpdated
            alarm {
                id
                afspraak {
                    id
                    omschrijving
                    bedrag
                    credit
                    burgerId
                }
            }
            bankTransactions {
                id
                bedrag
                isCredit
            }
        }
        burgers {
            id
            voorletters
            voornamen
            achternaam
        }
    }
`;

export const GetSignalenQuery = gql`
    query getSignalen {
        signalen {
            id
            isActive
        }
    }
`;