import {gql} from "@apollo/client";
import {GebruikerFragment, OrganisatieFragment, AfspraakFragment} from "./fragments";

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

export const AddAgreementMutation = gql`
    mutation addAgreement(
        $gebruiker: Int
        $beschrijving: String
        $start_datum: Date
        $eind_datum: Date
        $aantal_betalingen: Int
        $jaren: Int
        $maanden: Int
        $weken: Int
        $dagen: Int
        $tegen_rekening: Int
        $bedrag: Bedrag
        $credit: Boolean
        $kenmerk: String
        $actief: Boolean
    ){
        addAfspraak(
            gebruikerId: $gebruiker
            beschrijving: $beschrijving
            startDatum: $start_datum
            eindDatum: $eind_datum
            aantalBetalingen: $aantal_betalingen
            interval: {
                jaren: $jaren
                maanden: $maanden
                weken: $weken
                dagen: $dagen
            },
            tegenRekeningId: $tegen_rekening
            bedrag: $bedrag
            credit: $credit
            kenmerk: $kenmerk
            actief: $actief
        ){
            ok
            afspraak {
                ...Afspraak
            }
        }
    }
    ${AfspraakFragment}
`;

export const UpdateGebruikerRekeningenMutation = gql`
	mutation updateGebruikerRekeningen(
		$gebruikerId: Int
		$rekeningen: [RekeningInput]
	){
        updateGebruikerRekeningen(
			gebruikerId: $gebruikerId
			rekeningen: $rekeningen
		){
			ok
			rekeningen {
				id
				iban
				rekeninghouder
			}
		}
	}
`