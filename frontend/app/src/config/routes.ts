import { isDev } from "../utils/things";

export enum Names {
	login = "inloggen",
	dashboard = "dashboard",
	burgers = "burgers",
	balances = "huishoudboekjes",
	organizations = "organisaties",
	banking = "bank",
	settings = "instellingen",
	notFound = "404",
	agreements = "afspraken"
}

export enum Subpage {
	edit = "bewerken",
	add = "toevoegen",
}

const Routes = {
	Home: "/",
	Login: `/${Names.login}`,
	Burgers: `/${Names.burgers}`,
	Burger: (id?: number, subpage?: Subpage) => `/${Names.burgers}${id ? `/${id}`: ""}${subpage ? `/${subpage}`:""}`,
	BurgerDetail: `/${Names.burgers}/:id(\\d+)`,
	BurgerEdit: `/${Names.burgers}/:id(\\d+)/bewerken`,
	BurgerNew: `/${Names.burgers}/toevoegen`,
	Organizations: `/${Names.organizations}`,
	Organization: (organizationId: number) => `/${Names.organizations}/${organizationId}`,
	CreateOrganization: `/${Names.organizations}/toevoegen`,
	OrganizationNew: `/${Names.organizations}/toevoegen`,
	AgreementsNew: `/${Names.agreements}/toevoegen`,

	Dashboard: `/${Names.dashboard}`,
	Balances: `/${Names.balances}`,
	Banking: `/${Names.banking}`,
	Settings: `/${Names.settings}`,
	NotFound: `/${Names.notFound}`,

	...(isDev && { GraphiQL: "/api/graphql" }),
};

export default Routes;