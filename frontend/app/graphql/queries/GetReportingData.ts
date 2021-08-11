import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/Burger";
import {GrootboekrekeningFragment} from "../fragments/Grootboekrekening";
import {TransactieFragment} from "../fragments/Transactie";

export const GetReportingDataQuery = gql`
    query getReportingData {
        burgers {
            ...Burger
        }
        bankTransactions{
            ...BankTransaction
            journaalpost {
                id
                isAutomatischGeboekt
                afspraak {
                    ...Afspraak
                    rubriek{
                        id
                        naam
                    }
                }
                grootboekrekening {
                    ...Grootboekrekening
                    rubriek {
                        id
                        naam
                    }
                }
            }
        }
        rubrieken {
            id
            naam
        }
    }
    ${TransactieFragment}
    ${GrootboekrekeningFragment}
    ${BurgerFragment}
`;