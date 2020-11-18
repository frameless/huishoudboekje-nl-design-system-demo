import {isDev} from "../utils/things";

export enum RouteNames {
	login = "inloggen",
	burgers = "burgers",
	agreements = "afspraken",
	organizations = "organisaties",
	banking = "bankzaken",
	transactions = "transacties",
	csms = "bankbestanden",
	notFound = "404",

	// Sub routes
	add = "toevoegen",
	edit = "bewerken",

	// Not in use yet
	balances = "huishoudboekjes",
	settings = "instellingen",
}

const Routes = {
	Home: "/",
	Login: `/${RouteNames.login}`,

	Burgers: `/${RouteNames.burgers}`,
	Burger: (id?: number) => `/${RouteNames.burgers}/${id || ":id(\\d+)"}`,
	CreateBurger: `/${RouteNames.burgers}/${RouteNames.add}`,
	EditBurger: (id: number) => `/${RouteNames.burgers}/${id}/${RouteNames.edit}`,

	BurgerAgreements: (id?: number) => `/${RouteNames.burgers}/${id || ":burgerId(\\d+)"}/${RouteNames.agreements}`,
	CreateBurgerAgreement: (burgerId: number) => `/${RouteNames.burgers}/${burgerId}/${RouteNames.agreements}/${RouteNames.add}`,
	EditAgreement: (id?: number) => `/${RouteNames.agreements}/${id || ":id(\\d+)"}/${RouteNames.edit}`,

	Organizations: `/${RouteNames.organizations}`,
	Organization: (id?: number) => `/${RouteNames.organizations}/${id || ":id(\\d+)"}`,
	CreateOrganization: `/${RouteNames.organizations}/${RouteNames.add}`,
	EditOrganization: (id: number) => `/${RouteNames.organizations}/${id}/${RouteNames.edit}`,

	Banking: `/${RouteNames.banking}`,
	Transactions: `/${RouteNames.banking}/${RouteNames.transactions}`,
	CSMs: `/${RouteNames.banking}/${RouteNames.csms}`,

	NotFound: `/${RouteNames.notFound}`,

	// Dev things
	...(isDev && {GraphiQL: "/api/graphql"}),

	// Not in use yet
	Balances: `/${RouteNames.balances}`,
	Settings: `/${RouteNames.settings}`,
};

export default Routes;