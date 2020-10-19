export type IGebruiker = {
	__typename: "Gebruiker",
<<<<<<< HEAD
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
=======
	id: number,
	telefoonnummer: string,
	email: string,
	geboortedatum: string,
	burger: IBurger,
	weergaveNaam: string,
}

export type IBurger = {
	__typename: "Burger",
	achternaam: string,
	huisnummer: string,
	postcode: string,
	straatnaam: string,
	voorletters: string,
	voornamen: string,
	woonplaatsnaam: string
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
>>>>>>> 99a5f43... Added organizations overview page and create page.
}