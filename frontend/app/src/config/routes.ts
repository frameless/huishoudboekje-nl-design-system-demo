export enum RouteNames {
	login = "inloggen",
	huishoudens = "huishoudens",
	burgers = "burgers",
	afspraken = "afspraken",
	organisaties = "organisaties",
	afdelingen = "afdelingen",
	bankzaken = "bankzaken",
	transacties = "transacties",
	bankafschriften = "bankafschriften",
	betaalinstructies = "betaalinstructies",
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
	CreateAfdeling: (organisatieId) => `/${RouteNames.organisaties}/${organisatieId}/${RouteNames.afdelingen}/${RouteNames.add}`,

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