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
	gebruikers: IGebruiker[],
	organisaties: IOrganisatie[]
}
export type IRekeningInput = {
	id?: number
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

export type IInterval = {
	jaren: number
	maanden: number
	weken: number
	dagen: number
}

export type IAfspraak = {
	__typename: "Afspraak"
	id: number
	aantalBetalingen: number
	actief: boolean
	bedrag: number
	beschrijving: string
	credit: boolean
	eindDatum: Date
	gebruiker: IGebruiker
	interval: IInterval
	kenmerk: string
	startDatum: Date
	tegenRekening: IRekening
}