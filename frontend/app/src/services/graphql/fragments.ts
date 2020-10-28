import {gql} from "@apollo/client";

export const RekeningFragment = gql`
	fragment Rekening on Rekening {
		iban
		rekeninghouder
	}
`
export const AfspraakFragment = gql`
    fragment Afspraak on Afspraak {
        id
        beschrijving
        startDatum
        eindDatum
        aantalBetalingen
        interval {
            dagen
            weken
            maanden
            jaren
        }
        tegenRekening {
			...Rekening
		}
        bedrag
        credit
        kenmerk
        actief
    }
	${RekeningFragment}
`

export const GebruikerFragment = gql`
    fragment Gebruiker on Gebruiker {
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