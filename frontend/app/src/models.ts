export enum AfspraakType {
	Expense = "expense",
	Income = "income"
}

export enum AfspraakPeriod {
	Periodic = "periodic",
	Once = "once"
}

export enum IntervalType {
	Day = "day",
	Week = "week",
	Month = "month",
	Year = "year"
}

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

export type IGrootboekrekening = {
	id: string
    referentie: string
    naam: string
    omschrijving_kort: String
    omschrijving_lang: String
}

export type IRubriek = {
	id: number,
	naam: string
	grootboekrekening: IGrootboekrekening
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
	aantalBetalingen: number,
	actief: boolean,
	rubriek: IRubriek
}

export type IGrootboekrekening = {
	id: string
	naam: string
}
export type IJournaalpost = {
	id: number
	afspraak: IAfspraak
	grootboekrekening: IGrootboekrekening
}
export type IBankTransaction = {
	customerStatementMessage: ICustomerStatementMessage
	id: number
	informationToAccountOwner: string
	statementLine: string
	bedrag: number
	isCredit: boolean
	tegenRekening?: IRekening
	tegenRekeningIban: string
	transactieDatum: Date
	journaalpost?: IJournaalpost
}

export type ICustomerStatementMessage = {
	accountIdentification: string
	bankTransactions: IBankTransaction[]
	closingAvailableFunds: number
	closingBalance: number
	forwardAvailableBalance: number
	id: number
	openingBalance: number
	relatedReference: string
	sequenceNumber: string
	transactionReferenceNumber: string
	uploadDate: Date
};