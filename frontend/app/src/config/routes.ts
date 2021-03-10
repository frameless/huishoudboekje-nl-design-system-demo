export enum RouteNames {
	login = "inloggen",
	burgers = "burgers",
	afspraken = "afspraken",
	organisaties = "organisaties",
	bankzaken = "bankzaken",
	transacties = "transacties",
	overschrijvingen = "overschrijvingen",
	bronbestanden = "bronbestanden",
	rapportage = "rapportage",
	gebeurtenissen = "gebeurtenissen",
	notFound = "404",

	// Sub routes
	add = "toevoegen",
	edit = "bewerken",
	export = "exporteren",

	// Not in use yet
	settings = "instellingen",
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
	EditAfspraak: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.edit}`,

	Organisaties: `/${RouteNames.organisaties}`,
	Organisatie: (id?: number) => `/${RouteNames.organisaties}/${id || ":id(\\d+)"}`,
	CreateOrganisatie: `/${RouteNames.organisaties}/${RouteNames.add}`,
	EditOrganisatie: (id: number) => `/${RouteNames.organisaties}/${id}/${RouteNames.edit}`,

	Bankzaken: `/${RouteNames.bankzaken}`,
	Transacties: `/${RouteNames.bankzaken}/${RouteNames.transacties}`,
	Bronbestanden: `/${RouteNames.bankzaken}/${RouteNames.bronbestanden}`,
	Overschrijvingen: `/${RouteNames.bankzaken}/${RouteNames.overschrijvingen}/${RouteNames.export}`,
	Settings: `/${RouteNames.settings}`,
	Rapportage: `/${RouteNames.rapportage}`,
	Gebeurtenissen: `/${RouteNames.gebeurtenissen}`,

	NotFound: `/${RouteNames.notFound}`,

	// Dev things
	GraphiQL: "/api/graphql",
};

export default Routes;