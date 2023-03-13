import {gql} from "@apollo/client";

export const GetReportingDataQuery = gql`
    query getReportingData {
        burgers {
            id
            voornamen
            achternaam
            voorletters
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
                    burger {
                        id
                    }
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