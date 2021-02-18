import {gql} from "@apollo/client";
import {AfspraakFragment, BankTransactionFragment, CustomerStatementMessageFragment, GebruikerFragment, GrootboekrekeningFragment, OrganisatieFragment, RubriekFragment} from "./fragments";

export const GetAllBurgersQuery = gql`
    query getAllBurgers {
        gebruikers {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;

export const GetOneBurgerQuery = gql`
    query getOneBurger($id: Int!) {
        gebruiker(id: $id) {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;

export const GetBurgerAfsprakenQuery = gql`
    query getBurgerAfspraken($id: Int!) {
        gebruiker(id: $id) {
            afspraken{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;

export const GetAllOrganisatiesQuery = gql`
    query getAllOrganisaties {
        organisaties{
            id
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;

export const GetOneOrganisatieQuery = gql`
    query getOneOrganisatie($id: Int!) {
        organisatie(id: $id){
            ...Organisatie
        }
    }
    ${OrganisatieFragment}
`;

export const GetAllAfsprakenQuery = gql`
    query getAllAfspraken {
        afspraken{
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;

export const GetOneAfspraakQuery = gql`
    query getOneAfspraak($id: Int!) {
        afspraak(id: $id){
            ...Afspraak
        }
    }
    ${AfspraakFragment}
`;

export const GetAllCustomerStatementMessagesQuery = gql`
    query getAllCsms{
        customerStatementMessages{
            ...CustomerStatementMessage
        }
    }
    ${CustomerStatementMessageFragment}
`;

export const GetAllTransactionsQuery = gql`
    query getAllTransactions {
        bankTransactions{
            ...BankTransaction
            journaalpost {
                id
                isAutomatischGeboekt
                afspraak {
                    ...Afspraak
                    rubriek{
                        id
                        naam
                    }
                }
                grootboekrekening {
                    ...Grootboekrekening
                    rubriek {
                        id
                        naam
                    }
                }
            }
        }
    }
    ${BankTransactionFragment}
    ${GrootboekrekeningFragment}
`;

export const GetAllRubriekenQuery = gql`
    query getAllRubrieken {
        rubrieken{
            ...Rubriek
            grootboekrekening{
                id
                naam
            }
        }
    }
    ${RubriekFragment}
`;

export const GetTransactionItemFormDataQuery = gql`
    query getTransactionItemFormData {
        rubrieken {
            ...Rubriek
            grootboekrekening{
                id
                naam
            }
        }
        afspraken {
            ...Afspraak
        }
    }
    ${RubriekFragment}
    ${AfspraakFragment}
`;

export const GetAfspraakFormDataQuery = gql`
    query getAfspraakFormData {
        rubrieken {
            ...Rubriek
            grootboekrekening{
                id
                naam
                credit
            }
        }
        organisaties {
            ...Organisatie
        }
        afspraken{
            ...Afspraak
        }
    }
    ${AfspraakFragment}
    ${RubriekFragment}
    ${OrganisatieFragment}
`;

export const GetConfiguratieQuery = gql`
    query getConfiguratie {
        configuraties {
            id
            waarde
        }
    }
`;

export const GetExportsQuery = gql`
    query getExports {
        exports {
            id
            naam
            timestamp
            startDatum
            eindDatum
            overschrijvingen{
                id
            }
        }
    }
`;

export const GetReportingDataQuery = gql`
    query getReportingData {
        gebruikers {
            ...Gebruiker
        }
        bankTransactions{
            ...BankTransaction
            journaalpost {
                id
                isAutomatischGeboekt
                afspraak {
                    ...Afspraak
                    rubriek{
                        id
                        naam
                    }
                }
                grootboekrekening {
                    ...Grootboekrekening
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

    ${BankTransactionFragment}
    ${GrootboekrekeningFragment}
    ${GebruikerFragment}
`;

export const GetGebeurtenissenQuery = gql`
    query GetGebeurtenissen {
        gebruikersactiviteiten {
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
            #            snapshotBefore {
            #                burger {
            #                    id
            #                }
            #                organisatie {
            #                    id
            #                }
            #                afspraak {
            #                    id
            #                }
            #                journaalpost {
            #                    id
            #                }
            #            }
            #            snapshotAfter {
            #                burger {
            #                    id
            #                }
            #                organisatie {
            #                    id
            #                }
            #                afspraak {
            #                    id
            #                }
            #                journaalpost {
            #                    id
            #                }
            #            }
            meta {
                userAgent
                ip
                applicationVersion
            }
        }
    }
`;