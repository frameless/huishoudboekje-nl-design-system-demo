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
        credit
        omschrijving
        referentie
        rubriek{
            id
            naam
        }
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
        omschrijving
        startDatum
        eindDatum
        aantalBetalingen
        automatischeIncasso
        automatischBoeken
        interval {
            dagen
            weken
            maanden
            jaren
        }
        burger{
            id
            voornamen
            voorletters
            achternaam
            plaatsnaam
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
            kvkDetails {
                naam
                plaatsnaam
            }
        }
        bedrag
        credit
        zoektermen
        actief
        rubriek {
            ...Rubriek
        }
        matchingAfspraken {
            id
            credit
            burger{
                voorletters
                voornamen
                achternaam
            }
            zoektermen
            bedrag
            omschrijving
            interval {
                dagen
                weken
                maanden
                jaren
            }
            tegenRekening {
                id
                iban
                rekeninghouder
            }
        }
    }
    ${RekeningFragment}
    ${RubriekFragment}
`;

export const BurgerFragment = gql`
    fragment Burger on Burger {
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
        id
        filename
        uploadDate
        accountIdentification
        closingAvailableFunds
        closingBalance
        forwardAvailableBalance
        openingBalance
        relatedReference
        sequenceNumber
        transactionReferenceNumber
        bankTransactions{
            ...BankTransaction
        }
    }
    ${BankTransactionFragment}
`;

export const JournaalpostFragment = gql`
    fragment Journaalpost on Journaalpost {
        id
    }
`;

export const GebruikerFragment = gql`
    fragment Gebruiker on Gebruiker {
        email
    }
`;

export const GebruikersactiviteitFragment = gql`
    fragment Gebruikersactiviteit on GebruikersActiviteit {
        id
        timestamp
        gebruikerId
        action
        entities {
            entityType
            entityId
            burger {
                id
                voorletters
                voornamen
                achternaam
            }
            organisatie {
                id
                weergaveNaam
            }
            afspraak {
                id
                organisatie{
                    id
                    weergaveNaam
                }
            }
            rekening {
                id
                iban
                rekeninghouder
            }
            customerStatementMessage{
                id
            }
        }
#        snapshotBefore{
#            burger{id}
#            organisatie{id}
#            afspraak{id}
#            journaalpost{id}
#        }
#        snapshotAfter{
#            burger{id}
#            organisatie{id}
#            afspraak{id}
#            journaalpost{id}
#        }
        meta {
            userAgent
            ip
            applicationVersion
        }
    }
`;