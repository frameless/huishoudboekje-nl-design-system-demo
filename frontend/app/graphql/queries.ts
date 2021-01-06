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
            }
        }
        organisaties {
            ...Organisatie
        }
    }
    ${RubriekFragment}
    ${OrganisatieFragment}
`;