export type IGebruiker = {
	__typename: "Gebruiker",
	id: number
	email: string
	telefoonnummer: string
	voorletters: string
	voornamen: string
	achternaam: string
	geboortedatum: string
	straatnaam: string
	huisnummer: string
	postcode: string
	plaatsnaam: string
	rekeningen: [IRekening]
	afspraken: [IAfspraak]
}

// __typename: "Afspraak"
export type IAfspraak = {
	id: number
	gebruiker: IGebruiker
	beschrijving: string
	startDatum: Date
	eindDatum: Date
	aantalBetalingen: number
	interval: string  // TODO use interval
	tegenRekening: IRekening
	bedrag: string
	credit: boolean
	kenmerk: string
	actief: boolean
}

// __typename: "Rekening"
export type IRekening = {
	iban: string
	rekeninghouder: string
}

export type IOrganisatie = {
	__typename: "Organisatie",
	id: number,
	kvkNummer: string,
	weergaveNaam: string,
	kvkDetails: IKvK,
}

export type IAfspraak = {
	__typename: "Organisatie",
	id: number,
	kvkNummer: string,
	weergaveNaam: string,
	kvkDetails: IKvK,
}

export type IKvK = {
	huisnummer: string,
	naam: string,
	nummer: number,
	plaatsnaam: string,
	postcode: string,
	straatnaam: string,
}