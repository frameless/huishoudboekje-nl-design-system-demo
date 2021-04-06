import {gql} from "@apollo/client";
import {GrootboekrekeningFragment} from "../fragments/GrootboekrekeningFragment";
import {TransactieFragment} from "../fragments/TransactieFragment";

export const GetTransactiesQuery = gql`
    query getTransacties {
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
            suggesties {
                ...Afspraak
            }
        }
    }
    ${TransactieFragment}
    ${GrootboekrekeningFragment}
`;