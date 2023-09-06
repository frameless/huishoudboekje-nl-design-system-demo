import {gql} from "@apollo/client";

export const GetBurgerAfsprakenQuery = gql`
    query getBurgerAfspraken($id: Int!) {
        burger(id: $id) {
            afspraken{
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
                matchingAfspraken {
                    id
                    credit
                    burger {
                        voorletters
                        voornamen
                        achternaam
                    }
                    zoektermen
                    bedrag
                    omschrijving
                    tegenRekening {
                        id
                        iban
                        rekeninghouder
                    }
                }
            }
        }
    }
`;