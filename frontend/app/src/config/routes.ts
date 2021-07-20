export enum RouteNames {
	notFound = "404",
	login = "inloggen",
	huishoudens = "huishoudens",
	burgers = "burgers",
	afspraken = "afspraken",
	organisaties = "organisaties",
	bankzaken = "bankzaken",
	transacties = "transacties",
	betaalinstructie = "betaalinstructie",
	betaalinstructies = "betaalinstructies",
	bankafschriften = "bankafschriften",
	rapportage = "rapportage",
	gebeurtenissen = "gebeurtenissen",
	configuratie = "configuratie",
	status = "status",

	// Sub routes
	view = "bekijken",
	add = "toevoegen",
	edit = "wijzigen",
	export = "exporteren",
	followUp = "vervolg",
}

const Routes = {
	Home: "/",
	Login: `/${RouteNames.login}`,

	Huishoudens: `/${RouteNames.huishoudens}`,
	Huishouden: (id?: number) => `/${RouteNames.huishoudens}/${id || ":id(\\d+)"}`,

	Burgers: `/${RouteNames.burgers}`,
	Burger: (id?: number) => `/${RouteNames.burgers}/${id || ":id(\\d+)"}`,
	CreateBurger: `/${RouteNames.burgers}/${RouteNames.add}`,
	EditBurger: (id: number) => `/${RouteNames.burgers}/${id}/${RouteNames.edit}`,

	BurgerAfspraken: (id?: number) => `/${RouteNames.burgers}/${id || ":burgerId(\\d+)"}/${RouteNames.afspraken}`,
	CreateBurgerAfspraken: (burgerId: number) => `/${RouteNames.burgers}/${burgerId}/${RouteNames.afspraken}/${RouteNames.add}`,

	Afspraken: `/${RouteNames.afspraken}`,
	ViewAfspraak: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.view}`,
	EditAfspraak: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.edit}`,
	FollowUpAfspraak: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.followUp}`,
	AfspraakBetaalinstructie: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.betaalinstructie}`,

	Organisaties: `/${RouteNames.organisaties}`,
	Organisatie: (id?: number) => `/${RouteNames.organisaties}/${id || ":id(\\d+)"}`,
	CreateOrganisatie: `/${RouteNames.organisaties}/${RouteNames.add}`,
	EditOrganisatie: (id: number) => `/${RouteNames.organisaties}/${id}/${RouteNames.edit}`,

	Bankzaken: `/${RouteNames.bankzaken}`,
	Transacties: `/${RouteNames.bankzaken}/${RouteNames.transacties}`,
	Bankafschriften: `/${RouteNames.bankzaken}/${RouteNames.bankafschriften}`,
	Betaalinstructies: `/${RouteNames.bankzaken}/${RouteNames.betaalinstructies}/${RouteNames.export}`,
	Configuratie: `/${RouteNames.configuratie}`,
	Rapportage: `/${RouteNames.rapportage}`,
	RapportageBurger: (burgerIds: number[]) => `/${RouteNames.rapportage}?burgerId=${burgerIds.join(",")}`,
	Gebeurtenissen: `/${RouteNames.gebeurtenissen}`,

	Export: (id: number) => `/api/export/${id}`,
	BrievenExport: (burgerId: number) => `/api/brievenexport/${burgerId}`,

	Status: `/${RouteNames.status}`,
	NotFound: `/${RouteNames.notFound}`,

	// Dev things
	GraphiQL: "/api/graphql",
	TestPage: "/test",
};

export default Routes;