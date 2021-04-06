import {gql} from "@apollo/client";
import {
	AfspraakFragment,
	BankTransactionFragment,
	BurgerFragment,
	CustomerStatementMessageFragment,
	GebruikerFragment, GebruikersactiviteitFragment,
	GrootboekrekeningFragment,
	OrganisatieFragment, RekeningFragment,
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
    query getAfspraakFormData($afspraakId: Int!) {
        afspraak(id: $afspraakId){
            ...Afspraak
        }
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
    }
    ${AfspraakFragment}
    ${RubriekFragment}
    ${OrganisatieFragment}
`;

export const GetCreateAfspraakFormDataQuery = gql`
    query getCreateAfspraakFormData($burgerId: Int!) {
        burger(id: $burgerId){
            rekeningen{
                ...Rekening
            }
        }
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
    }
    ${RekeningFragment}
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
    query GetGebeurtenissen($limit: Int!, $offset: Int!) {
        gebruikersactiviteitenPaged(start: $offset, limit: $limit) {
            gebruikersactiviteiten{
                ...Gebruikersactiviteit
            }
            pageInfo{
                count
            }
        }
    }
    ${GebruikersactiviteitFragment}
`;

export const GetBurgerGebeurtenissenQuery = gql`
    query GetBurgerGebeurtenissen($ids: [Int!]!, $limit: Int!, $offset: Int!) {
        gebruikersactiviteitenPaged(burgerIds: $ids, start: $offset, limit: $limit) {
            gebruikersactiviteiten{
                ...Gebruikersactiviteit
            }
            pageInfo{
                count
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