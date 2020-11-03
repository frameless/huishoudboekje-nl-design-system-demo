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
	rekeningen: IRekening[]
	afspraken: IAfspraak[]
}

export type IRekening = {
	__typename: "Rekening"
	id: number
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

export type IKvK = {
	huisnummer: string,
	naam: string,
	nummer: number,
	plaatsnaam: string,
	postcode: string,
	straatnaam: string,
}

export type IAfspraak = {
	__typename: "Afspraak"
	id: number
	gebruiker: IGebruiker
	beschrijving: string
	startDatum: Date
	eindDatum: Date
	aantalBetalingen: number
	interval: string  // TODO use interval
	tegenRekening: IRekening
	organisatie: IOrganisatie
	bedrag: string
	credit: boolean
	kenmerk: string
	actief: boolean
}