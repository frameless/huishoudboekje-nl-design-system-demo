export enum AfspraakType {
	Expense = "expense",
	Income = "income"
}
export enum AfspraakPeriod {
	Periodic = "periodic",
	Once = "once"
}
export type IntervalType = "day" | "week" | "month" | "year";

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
	rekeningen: IRekening[]
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
	gebruiker: IGebruiker
	credit: boolean
	beschrijving: string
	organisatie?: IOrganisatie,
	tegenRekening: IRekening,
	bedrag: number,
	kenmerk: string
	type: "periodic" | "once",
	interval: IInterval,
	startDatum: Date
	isContinuous: boolean,
	nBetalingen: number,
	actief: boolean,
}