import {gql} from "@apollo/client";
import {AfspraakFragment, CustomerStatementMessageFragment, GebruikerFragment, OrganisatieFragment, RekeningFragment} from "./fragments";

export const CreateGebruikerMutation = gql`
    mutation createGebruiker($input: CreateGebruikerInput) {
        createGebruiker(input: $input){
            ok
            gebruiker {
                ...Gebruiker
            }
        }
    }
    ${GebruikerFragment}
`;

export const UpdateGebruikerMutation = gql`
    mutation updateGebruiker(
        $id: Int!
        $voorletters: String
        $voornamen: String
        $achternaam: String
        $geboortedatum: String
        $straatnaam: String
        $huisnummer: String
        $postcode: String
        $plaatsnaam: String
        $telefoonnummer: String
        $email: String
    ){
        updateGebruiker(
            id: $id
            voorletters: $voorletters
            voornamen: $voornamen
            achternaam: $achternaam
            geboortedatum: $geboortedatum
            straatnaam: $straatnaam
            huisnummer: $huisnummer
            postcode: $postcode
            plaatsnaam: $plaatsnaam
            telefoonnummer: $telefoonnummer
            email: $email
        ){
            ok
            gebruiker {
                ...Gebruiker
            }
        }
    }
    ${GebruikerFragment}
`;

export const DeleteGebruikerMutation = gql`
    mutation deleteGebruiker($id: Int!){
        deleteGebruiker(id: $id) {
            ok
        }
    }
`;

export const CreateOrganizationMutation = gql`
    mutation createOrganization(
        $huisnummer: String
        $kvkNummer: String!
        $naam: String
        $plaatsnaam: String
        $postcode: String
        $straatnaam: String
        $weergaveNaam: String!
    ){
        createOrganisatie(
            input: {
                huisnummer: $huisnummer
                kvkNummer: $kvkNummer
                naam: $naam
                plaatsnaam: $plaatsnaam
                postcode: $postcode
                straatnaam: $straatnaam
                weergaveNaam: $weergaveNaam
            }
        ){
            ok
            organisatie {
                ...Organisatie
            }
        }
    }
    ${OrganisatieFragment}
`;

export const UpdateOrganizationMutation = gql`
    mutation updateOrganization(
        $id: Int!
        $huisnummer: String
        $kvkNummer: String
        $naam: String
        $plaatsnaam: String
        $postcode: String
        $straatnaam: String
        $weergaveNaam: String
    ) {
        updateOrganisatie(
            id: $id
            huisnummer: $huisnummer
            kvkNummer: $kvkNummer
            naam: $naam
            plaatsnaam: $plaatsnaam
            postcode: $postcode
            straatnaam: $straatnaam
            weergaveNaam: $weergaveNaam
        ){
            ok
            organisatie {
                ...Organisatie
            }
        }
    }
    ${OrganisatieFragment}
`;

export const DeleteOrganizationMutation = gql`
    mutation deleteOrganization($id: Int!){
        deleteOrganisatie(id: $id){
            ok
        }
    }
`;

export const CreateAfspraakMutation = gql`
    mutation createAfspraak(
        $input: AfspraakInput!
    ){
        createAfspraak(
            input: $input
        ){
            ok
            afspraak {
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;

export const DeleteAfspraakMutation = gql`
    mutation deleteAfspraak($id: Int!){
        deleteAfspraak(id: $id){
            ok
        }
    }
`;

export const UpdateAfspraakMutation = gql`
    mutation updateAfspraak(
        $id: Int!
        $input: AfspraakInput!
    ){
        updateAfspraak(
            id: $id
            input: $input
        ){
            ok
            afspraak{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;

export const CreateGebruikerRekeningMutation = gql`
    mutation createGebruikerRekening(
        $gebruikerId: Int!
        $rekening: RekeningInput!
    ){
        createGebruikerRekening(gebruikerId: $gebruikerId, rekening: $rekening){
            ok
            rekening{
                ...Rekening
            }
        }
    }
    ${RekeningFragment}
`;

export const DeleteGebruikerRekeningMutation = gql`
    mutation deleteGebruikerRekening(
        $id: Int!
        $gebruikerId: Int!
    ){
        deleteGebruikerRekening(id: $id, gebruikerId: $gebruikerId){
            ok
        }
    }
`;

export const CreateOrganizationRekeningMutation = gql`
    mutation createOrganizationRekening(
        $orgId: Int!
        $rekening: RekeningInput!
    ){
        createOrganisatieRekening(organisatieId: $orgId, rekening: $rekening){
            ok
            rekening{
                ...Rekening
            }
        }
    }
    ${RekeningFragment}
`;

export const DeleteOrganizationRekeningMutation = gql`
    mutation deleteOrganizationRekening(
        $id: Int!
        $orgId: Int!
    ){
        deleteOrganisatieRekening(organisatieId: $orgId, rekeningId: $id){
            ok
        }
    }
`;

export const CreateCustomerStatementMessageMutation = gql`
    mutation createCustomerStatementMessage($file: Upload!){
        createCustomerStatementMessage(file: $file){
            ok
            customerStatementMessage{
                ...CustomerStatementMessage
            }
        }
    }
    ${CustomerStatementMessageFragment}
`;

export const DeleteCustomerStatementMessageMutation = gql`
    mutation deleteCustomerStatementMessage($id: Int!){
        deleteCustomerStatementMessage(id: $id){
            ok
        }
    }
`;

export const CreateJournaalpostGrootboekrekeningMutation = gql`
    mutation createJournaalpostGrootboekrekening($transactionId: Int! $grootboekrekeningId: String!){
        createJournaalpostGrootboekrekening(input: {
            transactionId: $transactionId,
            grootboekrekeningId: $grootboekrekeningId
        }){
            ok
            journaalpost{
                id
            }
        }
    }
`;

export const UpdateJournaalpostGrootboekrekeningMutation = gql`
    mutation updateJournaalpostGrootboekrekening($id: Int!, $grootboekrekeningId: String!){
        updateJournaalpostGrootboekrekening(input: {
            id: $id
            grootboekrekeningId: $grootboekrekeningId
        }){
            ok
        }
    }
`;

export const DeleteJournaalpostMutation = gql`
    mutation deleteJournaalpost($id: Int!){
        deleteJournaalpost(id: $id){
            ok
        }
    }
`;