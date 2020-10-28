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
}

export enum Subpage {
	edit = "bewerken",
}

const ADD = "toevoegen";

const Routes = {
	Home: "/",
	Login: `/${Names.login}`,
	Burgers: `/${Names.burgers}`,
	Burger: (id?: number, subpage?: Subpage) => `/${Names.burgers}${id ? `/${id}`: ""}${subpage ? `/${subpage}`:""}`,
	BurgerDetail: `/${Names.burgers}/:id(\\d+)`,
	BurgerEdit: `/${Names.burgers}/:id(\\d+)/bewerken`,
	BurgerNew: `/${Names.burgers}/toevoegen`,
	Agreement: (burgerId: number, id: number, subpage?: Subpage) => `/${Names.burgers}/${burgerId}/${Names.agreements}/${id}${subpage ? `/${subpage}`:""}`,
	AgreementNew: (burgerId: number) => `/${Names.burgers}/${burgerId}/${Names.agreements}/toevoegen`,
	Organizations: `/${Names.organizations}`,
	Organization: (organizationId: number) => `/${Names.organizations}/${organizationId}`,
	CreateOrganization: `/${Names.organizations}/toevoegen`,
	OrganizationNew: `/${Names.organizations}/toevoegen`,

	Dashboard: `/${Names.dashboard}`,
	Balances: `/${Names.balances}`,
	Banking: `/${Names.banking}`,
	Settings: `/${Names.settings}`,
	NotFound: `/${Names.notFound}`,

	...(isDev && { GraphiQL: "/api/graphql" }),
};

export default Routes;