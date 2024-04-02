import {gql} from "@apollo/client";

export const GetAfspraakQuery = gql`
    query getAfspraak($id: Int!) {
        afspraak(id: $id){
            id
            uuid
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
            }
            alarmId
            alarm {
                id
                isActive
                amount
                amountMargin
                startDate
                endDate
                dateMargin
                checkOnDate
                recurringDay
                recurringMonths
                recurringDayOfMonth
                AlarmType
            }
            afdeling {
                id
                naam
                organisatie {
                    id
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
            }
        }
    }
`;