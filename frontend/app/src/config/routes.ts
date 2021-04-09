export enum RouteNames {
	notFound = "404",
	login = "inloggen",
	burgers = "burgers",
	afspraken = "afspraken",
	organisaties = "organisaties",
	bankzaken = "bankzaken",
	transacties = "transacties",
	overschrijvingen = "overschrijvingen",
	bankafschriften = "bankafschriften",
	rapportage = "rapportage",
	gebeurtenissen = "gebeurtenissen",
	configuratie = "configuratie",
	betaalinstructie = "betaalinstructie",

	// Sub routes
	view = "bekijken",
	add = "toevoegen",
	edit = "wijzigen",
	export = "exporteren",
}

const Routes = {
	Home: "/",
	Login: `/${RouteNames.login}`,

	Burgers: `/${RouteNames.burgers}`,
	Burger: (id?: number) => `/${RouteNames.burgers}/${id || ":id(\\d+)"}`,
	CreateBurger: `/${RouteNames.burgers}/${RouteNames.add}`,
	EditBurger: (id: number) => `/${RouteNames.burgers}/${id}/${RouteNames.edit}`,

	BurgerAfspraken: (id?: number) => `/${RouteNames.burgers}/${id || ":burgerId(\\d+)"}/${RouteNames.afspraken}`,
	CreateBurgerAfspraken: (burgerId: number) => `/${RouteNames.burgers}/${burgerId}/${RouteNames.afspraken}/${RouteNames.add}`,

	Afspraken: `/${RouteNames.afspraken}`,
	ViewAfspraak: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.view}`,
	EditAfspraak: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.edit}`,
	AfspraakBetaalinstructie: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.betaalinstructie}`,

	Organisaties: `/${RouteNames.organisaties}`,
	Organisatie: (id?: number) => `/${RouteNames.organisaties}/${id || ":id(\\d+)"}`,
	CreateOrganisatie: `/${RouteNames.organisaties}/${RouteNames.add}`,
	EditOrganisatie: (id: number) => `/${RouteNames.organisaties}/${id}/${RouteNames.edit}`,

	Bankzaken: `/${RouteNames.bankzaken}`,
	Transacties: `/${RouteNames.bankzaken}/${RouteNames.transacties}`,
	Bankafschriften: `/${RouteNames.bankzaken}/${RouteNames.bankafschriften}`,
	Overschrijvingen: `/${RouteNames.bankzaken}/${RouteNames.overschrijvingen}/${RouteNames.export}`,
	Configuratie: `/${RouteNames.configuratie}`,
	Rapportage: `/${RouteNames.rapportage}`,
	Gebeurtenissen: `/${RouteNames.gebeurtenissen}`,

	NotFound: `/${RouteNames.notFound}`,

	// Dev things
	GraphiQL: "/api/graphql",
};

export default Routes;