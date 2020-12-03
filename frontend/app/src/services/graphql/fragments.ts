import {gql} from "@apollo/client";

export const RekeningFragment = gql`
    fragment Rekening on Rekening {
        id
        iban
        rekeninghouder
    }
`;

export const GrootboekrekeningFragment = gql`
    fragment Grootboekrekening on Grootboekrekening {
        id
        naam
        omschrijving
        referentie
    }
`;

export const RubriekFragment = gql`
    fragment Rubriek on Rubriek {
        id
        naam
        grootboekrekening {
            ...Grootboekrekening
        }
    }
    ${GrootboekrekeningFragment}
`;

export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        beschrijving
        startDatum
        eindDatum
        aantalBetalingen
        #        automatischeIncasso
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
        rubriek {
            ...Rubriek
        }
    }
    ${RekeningFragment}
    ${RubriekFragment}
`;

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
            #            overschrijvingen {
            #                bedrag
            #                datum
            #                id
            #                status
            #                bankTransaction {
            #                    id
            #                }
            #            }
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
        bedrag
        isCredit
        tegenRekeningIban
        tegenRekening {
            iban
            rekeninghouder
        }
        transactieDatum
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

export const JournaalpostFragment = gql`
    fragment Journaalpost on Journaalpost {
        id
    }
`;