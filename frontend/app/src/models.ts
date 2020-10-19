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
	iban: string
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