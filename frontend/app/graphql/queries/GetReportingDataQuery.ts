import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/BurgerFragment";
import {GrootboekrekeningFragment} from "../fragments/GrootboekrekeningFragment";
import {TransactieFragment} from "../fragments/TransactieFragment";

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