import {gql} from "@apollo/client";
import {
    AfspraakFragment,
    BankTransactionFragment,
    BurgerFragment,
    CustomerStatementMessageFragment,
    GebruikerFragment,
    GrootboekrekeningFragment,
    OrganisatieFragment,
    RubriekFragment,
} from "./fragments";

export const GetAllBurgersQuery = gql`
    query getAllBurgers {
        burgers {
            ...Burger
        }
    }
    ${BurgerFragment}
`;

export const GetOneBurgerQuery = gql`
    query getOneBurger($id: Int!) {
        burger(id: $id) {
            ...Burger
        }
    }
    ${BurgerFragment}
`;

export const GetBurgerAfsprakenQuery = gql`
    query getBurgerAfspraken($id: Int!) {
        burger(id: $id) {
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
            suggesties {
                ...Afspraak
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
        burgers {
            ...Burger
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
    ${BurgerFragment}
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

export const GetBurgerGebeurtenissenQuery = gql`
    query GetBurgerGebeurtenissen($ids: [Int!]!) {
        gebruikersactiviteiten(burgerIds: $ids) {
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


export const GetGebruikerQuery = gql`
    query getGebruiker {
        gebruiker {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;
