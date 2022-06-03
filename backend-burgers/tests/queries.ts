import {gql} from "apollo-server";

export const GetOneBurger = gql`
    query getOneBurger($bsn: Int!) {
        burger(bsn: $bsn) {
            id
            bsn
            voorletters
            voornamen
            achternaam
            geboortedatum
            telefoonnummer
            email
            straatnaam
            huisnummer
            postcode
            plaatsnaam
            rekeningen {
                id
                iban
                rekeninghouder
                afdelingen {
                    id
                    naam
                    organisatie {
                        id
                        naam
                        kvknummer
                        vestigingsnummer
                    }
                }
            }
            afspraken {
                id
                omschrijving
                bedrag
                credit
                betaalinstructie {
                    byDay
                    byMonth
                    byMonthDay
                    repeatFrequency
                    exceptDates
                    startDate
                    endDate
                }
                validFrom
                validThrough
                tegenrekening {
                    id
                    iban
                    rekeninghouder
                    afdelingen {
                        id
                    }
                }
                journaalposten {
                    id
                    banktransactie {
                        id
                        bedrag
                        isCredit
                        tegenrekeningIban
                        tegenrekening {
                            id
                            iban
                            rekeninghouder
                        }
                        informationToAccountOwner
                    }
                    afspraak {
                        id
                        omschrijving
                        bedrag
                        credit
                        betaalinstructie {
                            byDay
                            byMonth
                            byMonthDay
                            repeatFrequency
                            exceptDates
                            startDate
                            endDate
                        }
                        validFrom
                        validThrough
                        tegenrekening {
                            id
                            iban
                            rekeninghouder
                            afdelingen {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;
