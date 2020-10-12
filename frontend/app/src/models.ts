export type IGebruiker = {
	__typename: "Gebruiker",
	id: number,
	telefoonnummer: string,
	email: string,
	geboortedatum: string,
	iban: string,
	burger: IBurger,
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