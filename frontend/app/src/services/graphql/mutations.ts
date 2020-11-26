import {gql} from "@apollo/client";
import {AfspraakFragment, CustomerStatementMessageFragment, GebruikerFragment, OrganisatieFragment, RekeningFragment} from "./fragments";

export const CreateGebruikerMutation = gql`
    mutation createGebruiker(
        $input: CreateGebruikerInput
    ) {
        createGebruiker(
            input: $input
        ){
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
        $aantalBetalingen: Int
        $actief: Boolean
        $bedrag: Bedrag
        $beschrijving: String
        $credit: Boolean
        $eindDatum: Date
        $gebruikerId: Int
        $interval: IntervalInput
        $kenmerk: String
        $startDatum: Date
        $tegenRekeningId: Int
        $organisatieId: Int
        $rubriekId: Int
    ){
        createAfspraak(
            aantalBetalingen: $aantalBetalingen
            actief: $actief
            bedrag: $bedrag
            beschrijving: $beschrijving
            credit: $credit
            eindDatum: $eindDatum
            gebruikerId: $gebruikerId
            interval: $interval
            kenmerk: $kenmerk
            startDatum: $startDatum
            tegenRekeningId: $tegenRekeningId
            organisatieId: $organisatieId
            rubriekId: $rubriekId
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
        $aantalBetalingen: Int
        $actief: Boolean
        $bedrag: Bedrag
        $beschrijving: String
        $credit: Boolean
        $eindDatum: String
        $gebruikerId: Int
        $interval: IntervalInput
        $kenmerk: String
        $organisatieId: Int
        $startDatum: String
        $tegenRekeningId: Int
        $rubriekId: Int
    ){
        updateAfspraak(
            id: $id
            aantalBetalingen: $aantalBetalingen
            actief: $actief
            bedrag: $bedrag
            beschrijving: $beschrijving
            credit: $credit
            eindDatum: $eindDatum
            gebruikerId: $gebruikerId
            interval: $interval
            kenmerk: $kenmerk
            organisatieId: $organisatieId
            startDatum: $startDatum
            tegenRekeningId: $tegenRekeningId
            rubriekId: $rubriekId
        ){
            ok
            afspraak{
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;

export const ToggleAfspraakActiefMutation = gql`
    mutation toggleAfspraakMutation(
        $id: Int!
        $gebruikerId: Int!
        $actief: Boolean!
    ){
        updateAfspraak(
            id: $id
            gebruikerId: $gebruikerId,
            actief: $actief
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
    mutation createCustomerStatementMessage(
        $file: Upload!
    ){
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
    mutation deleteCustomerStatementMessage(
        $id: Int!
    ){
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
`