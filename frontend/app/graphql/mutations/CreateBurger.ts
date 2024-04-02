import { gql } from "@apollo/client";

export const CreateBurgerMutation = gql`
    mutation createBurger($input: CreateBurgerInput) {
        createBurger(input: $input){
            ok
            burger {
                id
                bsn
                email
                telefoonnummer
                voorletters
                voornamen
                achternaam
                geboortedatum
                straatnaam
                huisnummer
                postcode
                plaatsnaam
                rekeningen {
                    id
                    iban
                    rekeninghouder
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
                huishouden {
                    id
                    burgers {
                        id
                    }
                }
            }
        }
    }
`;