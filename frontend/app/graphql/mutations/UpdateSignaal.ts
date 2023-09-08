import {gql} from "@apollo/client";

export const UpdateSignaalMutation = gql`
    mutation updateSignaal($id: String!, $input: UpdateSignaalInput!){
        updateSignaal(id: $id, input: $input){
            ok
            signaal {
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
                        betaalinstructie {
                            byDay
                            byMonth
                            byMonthDay
                            exceptDates
                            repeatFrequency
                            startDate
                            endDate
                        }
                        zoektermen
                        validFrom
                        validThrough
                        burger {
                            id
                            bsn
                            voornamen
                            voorletters
                            achternaam
                            plaatsnaam
                            rekeningen {
                                id
                                iban
                                rekeninghouder
                            }
                        }
                        alarm {
                            id
                            isActive
                            bedrag
                            bedragMargin
                            startDate
                            endDate
                            datumMargin
                            byDay
                            byMonth
                            byMonthDay
                            afspraak {
                                id
                            }
                            signaal {
                                id
                            }
                        }
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
                        postadres {
                            id
                            straatnaam
                            huisnummer
                            postcode
                            plaatsnaam
                        }
                        tegenRekening {
                            id
                            iban
                            rekeninghouder
                        }
                        rubriek {
                            id
                            naam
                            grootboekrekening {
                                id
                                naam
                                credit
                                omschrijving
                                referentie
                                rubriek{
                                    id
                                    naam
                                }
                            }
                        }
                    }
                }
                bankTransactions {
                    id
                    bedrag
                    isCredit
                }
            }
        }
    }
`;