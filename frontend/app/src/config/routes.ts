export enum RouteNames {
	login = "inloggen",
	huishoudens = "huishoudens",
	burgers = "burgers",
	personal = "persoonlijk",
	afspraken = "afspraken",
	organisaties = "organisaties",
	afdelingen = "afdelingen",
	bankzaken = "bankzaken",
	transacties = "transacties",
	bankafschriften = "bankafschriften",
	betaalinstructies = "betaalinstructies",
	signalen = "signalen",
	rapportage = "rapportage",
	gebeurtenissen = "gebeurtenissen",
	configuratie = "configuratie",
	export = "export",
	status = "status",
	notFound = "404",

	// Subroutes
	add = "toevoegen",
	edit = "wijzigen",
	followUp = "vervolg",
	betaalinstructie = "betaalinstructie",
}

export const AppRoutes = {
	Home: "/",
	Huishoudens: () => `/${RouteNames.huishoudens}`,
	Huishouden: (id) => `/${RouteNames.huishoudens}/${id}`,

	Burgers: () => `/${RouteNames.burgers}`,
	Burger: (id) => `/${RouteNames.burgers}/${id}`,
	BurgerPersonalDetails: (id) => `/${RouteNames.burgers}/${id}/${RouteNames.personal}`,
	CreateBurger: () => `/${RouteNames.burgers}/${RouteNames.add}`,
	EditBurger: (id) => `/${RouteNames.burgers}/${id}/${RouteNames.edit}`,
	CreateBurgerAfspraak: (burgerId) => `/${RouteNames.burgers}/${burgerId}/${RouteNames.afspraken}/${RouteNames.add}`,

	ViewAfspraak: (id) => `/${RouteNames.afspraken}/${id}`,
	EditAfspraak: (id) => `/${RouteNames.afspraken}/${id}/${RouteNames.edit}`,
	FollowUpAfspraak: (id) => `/${RouteNames.afspraken}/${id}/${RouteNames.followUp}`,
	AfspraakBetaalinstructie: (id) => `/${RouteNames.afspraken}/${id}/${RouteNames.betaalinstructie}`,

	Organisaties: `/${RouteNames.organisaties}`,
	Organisatie: (id) => `/${RouteNames.organisaties}/${id}`,
	CreateOrganisatie: `/${RouteNames.organisaties}/${RouteNames.add}`,
	EditOrganisatie: (id) => `/${RouteNames.organisaties}/${id}/${RouteNames.edit}`,
	Afdeling: (organisatieId, afdelingId) => `/${RouteNames.organisaties}/${organisatieId}/${RouteNames.afdelingen}/${afdelingId}`,

	Bankzaken: `/${RouteNames.bankzaken}`,
	Transacties: `/${RouteNames.bankzaken}/${RouteNames.transacties}`,
	Bankafschriften: `/${RouteNames.bankzaken}/${RouteNames.bankafschriften}`,
	Betaalinstructies: `/${RouteNames.bankzaken}/${RouteNames.betaalinstructies}/${RouteNames.export}`,
	Configuratie: `/${RouteNames.configuratie}`,
	Rapportage: `/${RouteNames.rapportage}`,
	RapportageBurger: (burgerIds: number[]) => `/${RouteNames.rapportage}?burgerId=${burgerIds.join(",")}`,
	Gebeurtenissen: `/${RouteNames.gebeurtenissen}`,

	Export: (id) => `/api/export/${id}`,
	BrievenExport: (burgerId, format: "excel" | "csv") => `/api/brievenexport/${burgerId}/${format}`,

	Status: `/${RouteNames.status}`,
	NotFound: `/${RouteNames.notFound}`,
};