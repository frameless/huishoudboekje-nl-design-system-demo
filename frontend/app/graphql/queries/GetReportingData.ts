import {gql} from "@apollo/client";
import {BurgerFragment} from "../fragments/Burger";
import {GrootboekrekeningFragment} from "../fragments/Grootboekrekening";
import {TransactieFragment} from "../fragments/Transactie";

export const GetReportingDataQuery = gql`
    query getReportingData {
        burgers {
            id
        }
        bankTransactions{
            id
            informationToAccountOwner
            statementLine
            bedrag
            isCredit
            tegenRekeningIban
            tegenRekening {
                iban
                rekeninghouder
            }
            transactieDatum
            journaalpost {
                id
                isAutomatischGeboekt
                afspraak {
                    id
                    omschrijving
                    bedrag
                    credit
                    zoektermen
                    validFrom
                    validThrough
                    afdeling {
                        id
                        naam
                        organisatie {
                            id
                            kvknummer
                            vestigingsnummer
                            naam
                        }
                    }
                }
                grootboekrekening {
                    id
                    naam
                    credit
                    omschrijving
                    referentie
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
`;