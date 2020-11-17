import {gql} from "@apollo/client";

export const RekeningFragment = gql`
    fragment Rekening on Rekening {
        id
        iban
        rekeninghouder
    }
`

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        beschrijving
        startDatum
        eindDatum
        aantalBetalingen
        interval {
            dagen
            weken
            maanden
            jaren
        }
        gebruiker{
            id
            voorletters
            achternaam
            rekeningen {
                ...Rekening
            }
        }
        tegenRekening {
            ...Rekening
        }
        organisatie {
            id
            weergaveNaam
        }
        bedrag
        credit
        kenmerk
        actief
    }
    ${RekeningFragment}
`

export const GebruikerFragment = gql`
    fragment Gebruiker on Gebruiker {
        id
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
            ...Rekening
        }
        afspraken {
            ...Afspraak
        }
    }
    ${AfspraakFragment}
    ${RekeningFragment}
`;

export const OrganisatieKvkDetailsFragment = gql`
    fragment Kvk on Organisatie {
        kvkDetails {
            huisnummer
            naam
            nummer
            plaatsnaam
            postcode
            straatnaam
        }
    }
`;

export const OrganisatieFragment = gql`
    fragment Organisatie on Organisatie {
        id
        kvkNummer
        weergaveNaam
        rekeningen {
            ...Rekening
        }
        ...Kvk
    }
    ${RekeningFragment}
    ${OrganisatieKvkDetailsFragment}
`;

export const BankTransactionFragment = gql`
    fragment BankTransaction on BankTransaction{
        id
        informationToAccountOwner
        statementLine
    }
`;

export const CustomerStatementMessageFragment = gql`
    fragment CustomerStatementMessage on CustomerStatementMessage {
        accountIdentification
        bankTransactions{
            ...BankTransaction
        }
        closingAvailableFunds
        closingBalance
        forwardAvailableBalance
        id
        openingBalance
        relatedReference
        sequenceNumber
        transactionReferenceNumber
        uploadDate
    }
    ${BankTransactionFragment}
`;