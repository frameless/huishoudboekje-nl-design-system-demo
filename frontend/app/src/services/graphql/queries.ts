import {gql} from "@apollo/client";
import {AfspraakFragment, BankTransactionFragment, CustomerStatementMessageFragment, GebruikerFragment, OrganisatieFragment, GrootboekrekeningFragment, RubriekFragment} from "./fragments";

export const GetAllGebruikersQuery = gql`
    query getAllGebruikers {
        gebruikers {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;

export const GetOneGebruikerQuery = gql`
    query getOneGebruiker($id: Int!) {
        gebruiker(id: $id) {
            ...Gebruiker
        }
    }
    ${GebruikerFragment}
`;

export const GetGebruikerAfsprakenQuery = gql`
    query getOneGebruikerAfspraken($id: Int!) {
        gebruiker(id: $id) {
            afspraken{
                ...Afspraak
                gebruiker {
                    id
                }
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
#            journaalpost {
#                id
#                afspraak {
#                    id
#                }
#                grootboekrekening {
#                    id
#                    debet
#                    naam
#                }
#            }
        }
    }
    ${BankTransactionFragment}
`;

export const GetAllGrootboekrekeningen = gql`
    query getAllGrootboekrekeningen {
        grootboekrekeningen{
            ...Grootboekrekening
        }
    }
    ${GrootboekrekeningFragment}
`;

export const GetAllRubrieken = gql`
    query getAllRubrieken {
        rubrieken {
            ...Rubriek
        }
    }
    ${RubriekFragment}
`;