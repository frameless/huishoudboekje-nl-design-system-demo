import {gql} from "@apollo/client";
import {AfspraakFragment, CustomerStatementMessageFragment, BurgerFragment, OrganisatieFragment, RekeningFragment} from "./fragments";

export const CreateBurgerMutation = gql`
    mutation createBurger($input: CreateBurgerInput) {
        createBurger(input: $input){
            ok
            burger {
                ...Burger
            }
        }
    }
    ${BurgerFragment}
`;

export const UpdateBurgerMutation = gql`
    mutation updateBurger(
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
        updateBurger(
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
            burger {
                ...Burger
            }
        }
    }
    ${BurgerFragment}
`;

export const DeleteBurgerMutation = gql`
    mutation deleteBurger($id: Int!){
        deleteBurger(id: $id) {
            ok
        }
    }
`;

export const CreateOrganisatieMutation = gql`
    mutation createOrganisatie(
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

export const UpdateOrganisatieMutation = gql`
    mutation updateOrganisatie(
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

export const DeleteOrganisatieMutation = gql`
    mutation deleteOrganisatie($id: Int!){
        deleteOrganisatie(id: $id){
            ok
        }
    }
`;

export const CreateAfspraakMutation = gql`
    mutation createAfspraak(
        $input: CreateAfspraakInput!
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
        $input: UpdateAfspraakInput!
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

export const CreateBurgerRekeningMutation = gql`
    mutation createBurgerRekening(
        $burgerId: Int!
        $rekening: RekeningInput!
    ){
        createBurgerRekening(burgerId: $burgerId, rekening: $rekening){
            ok
            rekening{
                ...Rekening
            }
        }
    }
    ${RekeningFragment}
`;

export const DeleteBurgerRekeningMutation = gql`
    mutation deleteBurgerRekening(
        $id: Int!
        $burgerId: Int!
    ){
        deleteBurgerRekening(id: $id, burgerId: $burgerId){
            ok
        }
    }
`;

export const CreateOrganisatieRekeningMutation = gql`
    mutation createOrganisatieRekening(
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

export const DeleteOrganisatieRekeningMutation = gql`
    mutation deleteOrganisatieRekening(
        $id: Int!
        $orgId: Int!
    ){
        deleteOrganisatieRekening(organisatieId: $orgId, rekeningId: $id){
            ok
        }
    }
`;

export const UpdateRekeningMutation = gql`
    mutation updateRekening($id: Int!, $iban: String, $rekeninghouder: String){
        updateRekening(id: $id, rekening: {
            iban: $iban,
            rekeninghouder: $rekeninghouder
        }){
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
            grootboekrekeningId: $grootboekrekeningId,
            isAutomatischGeboekt: false,
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
            grootboekrekeningId: $grootboekrekeningId,
        }){
            ok
        }
    }
`;

export const CreateJournaalpostAfspraakMutation = gql`
    mutation createJournaalpostAfspraak($transactionId: Int!, $afspraakId: Int!, $isAutomatischGeboekt: Boolean = false){
        createJournaalpostAfspraak(input: {
            transactionId: $transactionId,
            afspraakId: $afspraakId,
            isAutomatischGeboekt: $isAutomatischGeboekt
        }){
            ok
            journaalpost{
                id
            }
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

export const CreateConfiguratieMutation = gql`
    mutation createConfiguratie($key: String!, $value: String!) {
        createConfiguratie(input: {
            id: $key, waarde: $value
        }){
            ok
            configuratie{
                id
                waarde
            }
        }
    }
`;
export const UpdateConfiguratieMutation = gql`
    mutation updateConfiguratie($key: String!, $value: String!) {
        updateConfiguratie(input: {
            id: $key, waarde: $value
        }){
            ok
            configuratie{
                id
                waarde
            }
        }
    }
`;
export const DeleteConfiguratieMutation = gql`
    mutation deleteConfiguratie($key: String!) {
        deleteConfiguratie(id: $key){
            ok
        }
    }
`;

export const CreateExportOverschrijvingenMutation = gql`
    mutation createExportOverschrijvingen($startDatum: String!, $eindDatum: String!) {
        createExportOverschrijvingen(startDatum: $startDatum, eindDatum: $eindDatum){
            ok
            export{
                id
            }
        }
    }
`;

export const StartAutomatischBoekenMutation = gql`
    mutation startAutomatischBoeken{
        startAutomatischBoeken{
            ok
            journaalposten {
                id
            }
        }
    }
`;

export const UpdateAfspraakAutomatischBoekenMutation = gql`
    mutation updateAfspraakAutomatischBoeken($afspraakId: Int!, $automatischBoeken: Boolean!) {
        updateAfspraakAutomatischBoeken(afspraakId: $afspraakId, automatischBoeken: $automatischBoeken){
            ok
        }
    }
`;

export const UpdateAfspraakBetaalinstructie = gql`
    mutation updateAfspraakBetaalinstructie($id: Int!, $betaalinstructie: BetaalinstructieInput!) {
        updateAfspraakBetaalinstructie(afspraakId: $id, betaalinstructie: $betaalinstructie){
            ok
        }
    }
`;