import {isDev} from "../utils/things";

export enum RouteNames {
	login = "inloggen",
	burgers = "burgers",
	afspraken = "afspraken",
	organisaties = "organisaties",
	banking = "bankzaken",
	transacties = "transacties",
	bookings = "overschrijvingen",
	csms = "bronbestanden",
	notFound = "404",

	// Sub routes
	add = "toevoegen",
	edit = "bewerken",
	export = "exporteren",

	// Not in use yet
	huishoudboekjes = "huishoudboekjes",
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
	EditAgreement: (id?: number) => `/${RouteNames.afspraken}/${id || ":id(\\d+)"}/${RouteNames.edit}`,

	Organisaties: `/${RouteNames.organisaties}`,
	Organisatie: (id?: number) => `/${RouteNames.organisaties}/${id || ":id(\\d+)"}`,
	CreateOrganisatie: `/${RouteNames.organisaties}/${RouteNames.add}`,
	EditOrganisatie: (id: number) => `/${RouteNames.organisaties}/${id}/${RouteNames.edit}`,

	Banking: `/${RouteNames.banking}`,
	Transactions: `/${RouteNames.banking}/${RouteNames.transacties}`,
	CSMs: `/${RouteNames.banking}/${RouteNames.csms}`,
	Bookings: `/${RouteNames.banking}/${RouteNames.bookings}`,
	BookingsExport: `/${RouteNames.banking}/${RouteNames.bookings}/${RouteNames.export}`,
	Huishoudboekjes: `/${RouteNames.huishoudboekjes}`,
	Settings: `/${RouteNames.settings}`,

	NotFound: `/${RouteNames.notFound}`,

	// Dev things
	...(isDev && {GraphiQL: "/api/graphql"}),
};

export default Routes;