import {gql} from "@apollo/client";

const BurgerFragment = gql`
    fragment Burger on Burger {
        id
        bsn
        voorletters
        voornamen
        achternaam
        banktransacties {
            id
            bedrag
            isCredit
            informationToAccountOwner
            tegenrekening {
                id
                iban
                rekeninghouder
            }
            tegenrekeningIban
            transactiedatum
        }
        rekeningen {
            id
            iban
            rekeninghouder
        }
        afspraken {
            id
            betaalinstructie {
                byDay
                byMonth
                byMonthDay
                startDate
                endDate
            }
            bedrag
            credit
            omschrijving
            tegenrekening {
                id
                iban
                rekeninghouder
            }
        }
    }
`;

export default BurgerFragment;